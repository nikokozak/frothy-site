// Install one generated Frothy firmware bundle, release the serial port, and
// hand the user to the editor. The device manifest owns every flashed address.

import { ESPLoader, Transport } from "./vendor/esptool-js/0.6.0/bundle.js";
import {
  createConnector,
  WebSerialTransport,
} from "./vendor/frothy-repl/0.0.0/index.js";

const app = document.getElementById("app");
const fallback = document.getElementById("fallback");
const manifestURL = new URL("./firmware/manifest.json", import.meta.url);
let currentPort = null;
let lastPort = null;

const supported =
  "serial" in navigator && navigator.userAgentData?.mobile !== true;

if (!supported) {
  fallback.hidden = false;
} else {
  app.hidden = false;
  void initFlasher();
  window.addEventListener("beforeunload", () => {
    if (currentPort) {
      try { currentPort.close(); } catch {}
    }
  });
}

async function initFlasher() {
  const status = document.getElementById("status");
  const firmwareInfo = document.getElementById("firmware-info");
  const firmwareLabel = document.getElementById("firmware-label");
  const firmwareProfile = document.getElementById("firmware-profile");
  const firmwareVersion = document.getElementById("firmware-version");
  const firmwarePicker = document.getElementById("firmware-picker");
  const firmwareSelect = document.getElementById("firmware");
  const flashBtn = document.getElementById("flash");
  const checkBtn = document.getElementById("check");
  flashBtn.disabled = true;
  checkBtn.disabled = true;

  let manifest;
  try {
    setStatus(status, "Loading firmware…");
    const response = await fetch(manifestURL);
    if (!response.ok) throw new Error(`manifest fetch ${response.status}`);
    manifest = validateManifest(await response.json());
  } catch (err) {
    setStatus(status, `Firmware unavailable: ${err.message ?? err}`, true);
    return;
  }

  for (const [index, row] of manifest.entries()) {
    firmwareSelect.append(option(row.label, String(index)));
  }
  const showFirmware = (row) => {
    firmwareLabel.textContent = row.label;
    firmwareProfile.textContent = displayProfile(row.profile);
    firmwareVersion.textContent = row.version;
    firmwareInfo.hidden = false;
  };
  showFirmware(manifest[0]);
  if (manifest.length > 1) {
    firmwarePicker.hidden = false;
    firmwareSelect.addEventListener("change", () => {
      const row = manifest[Number(firmwareSelect.value)];
      if (row) showFirmware(row);
    });
  }
  status.hidden = true;
  flashBtn.disabled = false;
  checkBtn.disabled = false;
  flashBtn.addEventListener("click", () => {
    const row = manifest[Number(firmwareSelect.value)];
    if (row) void flash(row, [firmwareSelect, flashBtn, checkBtn]);
  });
  checkBtn.addEventListener("click", () => {
    void checkFrothy([firmwareSelect, flashBtn, checkBtn]);
  });
}

async function flash(row, lockables) {
  const status = document.getElementById("status");
  const progressWrap = document.getElementById("progress-wrap");
  const progressLabel = document.getElementById("progress-label");
  const progress = document.getElementById("progress");
  const continueLink = document.getElementById("continue");
  progressWrap.hidden = false;
  progressLabel.textContent = "Preparing firmware";
  progress.removeAttribute("value");
  continueLink.hidden = true;
  for (const element of lockables) element.disabled = true;

  let transport = null;
  try {
    setStatus(status, "Choose a serial port…");
    await releaseCurrentPort();
    currentPort = await navigator.serial.requestPort();
    lastPort = currentPort;

    setStatus(status, "Fetching firmware…");
    const fileArray = await fetchSegments(row);
    transport = new Transport(currentPort, false);

    setStatus(status, "Connecting to board…");
    const loader = new ESPLoader({
      transport,
      baudrate: 921600,
      romBaudrate: 115200,
    });
    const chip = await loader.main();
    setStatus(status, `Connected to ${chip}. Flashing…`);
    progressLabel.textContent = "Flash progress";
    progress.max = fileArray.length;
    progress.value = 0;
    progressWrap.hidden = false;

    await loader.writeFlash({
      fileArray,
      // ESP-IDF encoded these settings in the generated images; do not copy
      // flash_settings into a second browser-owned contract.
      flashMode: "keep",
      flashFreq: "keep",
      flashSize: "keep",
      eraseAll: false,
      compress: true,
      reportProgress: (index, written, total) => {
        const fraction = total ? written / total : 0;
        progress.value = index + fraction;
        const percent = Math.round((progress.value / progress.max) * 100);
        setStatus(status, `Flashing… ${percent}%`);
      },
    });

    setStatus(status, "Verifying and resetting…");
    await loader.after("hard_reset");
    await transport.disconnect();
    transport = null;
    currentPort = null;
    progress.value = progress.max;
    setStatus(status, "Done. Frothy is installed.");
    document.getElementById("flash").hidden = true;
    document.getElementById("firmware-picker").hidden = true;
    continueLink.hidden = false;
    for (const element of lockables) element.disabled = false;
  } catch (err) {
    const cancelled = err?.name === "NotFoundError";
    setStatus(
      status,
      cancelled ? "Cancelled." : `Flash failed: ${err.message ?? err}${portLockHint(err)}`,
      !cancelled,
    );
    if (transport) {
      try { await transport.disconnect(); } catch {}
      currentPort = null;
    }
    await releaseCurrentPort();
    progressWrap.hidden = true;
    for (const element of lockables) element.disabled = false;
  }
}

async function checkFrothy(lockables) {
  const status = document.getElementById("status");
  for (const element of lockables) element.disabled = true;
  let connector = null;
  try {
    setStatus(status, "Choose the Frothy board…");
    await releaseCurrentPort();
    const permitted = await navigator.serial.getPorts();
    currentPort = lastPort ?? (permitted.length === 1 ? permitted[0] : null);
    if (!currentPort) currentPort = await navigator.serial.requestPort();
    lastPort = currentPort;
    await currentPort.open({ baudRate: 115200 });
    connector = await createConnector(new WebSerialTransport(currentPort));
    setStatus(status, "Checking Frothy…");
    const deviceStatus = await withTimeout(
      connector.status(),
      8000,
      "Frothy did not answer the status check",
    );
    setStatus(status, `Frothy is ready · ${displayProfile(deviceStatus.profile)}`);
  } catch (err) {
    const cancelled = err?.name === "NotFoundError";
    setStatus(
      status,
      cancelled
        ? "Cancelled."
        : `Check failed: ${err.message ?? err}. Close other apps using the board, ` +
          "press EN (or unplug and reconnect it), then try again.",
      !cancelled,
    );
  } finally {
    if (connector) {
      try { await connector.close(); } catch {}
    } else {
      await releaseCurrentPort();
    }
    currentPort = null;
    for (const element of lockables) element.disabled = false;
  }
}

async function fetchSegments(row) {
  return Promise.all(row.segments.map(async (segment) => {
    const response = await fetch(new URL(segment.file, manifestURL));
    if (!response.ok) {
      throw new Error(`firmware fetch ${response.status} for ${segment.file}`);
    }
    return {
      address: segment.address,
      data: new Uint8Array(await response.arrayBuffer()),
    };
  }));
}

function validateManifest(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("manifest must contain firmware");
  }
  const boards = new Set();
  const files = new Set();
  for (const [rowIndex, row] of value.entries()) {
    for (const field of ["board", "profile", "label", "version"]) {
      if (typeof row?.[field] !== "string" || !row[field]) {
        throw new Error(`firmware ${rowIndex} has no ${field}`);
      }
    }
    if (boards.has(row.board)) {
      throw new Error(`manifest repeats board ${row.board}`);
    }
    boards.add(row.board);
    if (!Array.isArray(row.segments) || row.segments.length === 0) {
      throw new Error(`firmware ${rowIndex} has no segments`);
    }
    const addresses = new Set();
    for (const segment of row.segments) {
      if (!Number.isSafeInteger(segment?.address) || segment.address < 0) {
        throw new Error(`firmware ${rowIndex} has an invalid address`);
      }
      if (addresses.has(segment.address)) {
        throw new Error(`firmware ${rowIndex} repeats address ${segment.address}`);
      }
      addresses.add(segment.address);
      if (typeof segment.file !== "string" || !/^[A-Za-z0-9._-]+\.bin$/.test(segment.file)) {
        throw new Error(`firmware ${rowIndex} has an invalid segment file`);
      }
      if (files.has(segment.file)) {
        throw new Error(`manifest repeats segment file ${segment.file}`);
      }
      files.add(segment.file);
    }
  }
  return value;
}

async function releaseCurrentPort() {
  if (!currentPort) return;
  try { await currentPort.close(); } catch {}
  currentPort = null;
}

function portLockHint(err) {
  const message = err?.message ?? String(err);
  if (/Failed to connect|access|locked/i.test(message)) {
    return " — close other flasher tabs or restart the browser to release the serial port.";
  }
  return "";
}

function displayProfile(profile) {
  return profile === "esp32_plain" ? "ESP32 Default" : profile;
}

function withTimeout(promise, ms, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

function setStatus(element, text, isError = false) {
  element.hidden = false;
  element.textContent = text;
  element.classList.toggle("err", isError);
}

function option(label, value) {
  const element = document.createElement("option");
  element.value = value;
  element.textContent = label;
  return element;
}
