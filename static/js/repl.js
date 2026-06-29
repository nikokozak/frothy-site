/* Homepage interactivity (loaded only on the home page):
   - the hero "blink" editor that types itself, presses Run, and blinks the LED
   - playground tab switching
   - install tab switching
   - nav "scrolled" border state
   Reuses window.highlightFrothHTML from froth-highlight.js. */
(function () {
  var hl = window.highlightFrothHTML || function (s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  /* ---------------- nav scrolled state ---------------- */
  var nav = document.querySelector("[data-nav]");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- tab groups (playground + install) ---------------- */
  function wireTabs(root, tabAttr, paneAttr, opts) {
    opts = opts || {};
    if (!root) return;
    var tabs = root.querySelectorAll("[" + tabAttr + "]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute(tabAttr);
        tabs.forEach(function (t) { t.classList.toggle("cur", t === tab); });
        root.querySelectorAll("[" + paneAttr + "]").forEach(function (pane) {
          pane.hidden = pane.getAttribute(paneAttr) !== key;
        });
        if (opts.onChange) opts.onChange(key);
      });
    });
  }

  var play = document.querySelector("[data-play]");
  if (play) {
    var names = ["scale.fr", "blink.fr", "sensor.fr", "redefine.fr", "events.fr", "sleep.fr", "image.fr", "wifi.fr", "watchdog.fr"];
    var nameEl = play.querySelector("[data-play-name]");
    // keep the code pane + its commentary in sync, and update the filename
    wireTabs(play, "data-play-tab", "data-play-code-pane", {
      onChange: function (key) {
        play.querySelectorAll("[data-play-note-pane]").forEach(function (p) {
          p.hidden = p.getAttribute("data-play-note-pane") !== key;
        });
        if (nameEl && names[+key]) nameEl.textContent = names[+key];
      }
    });
  }
  wireTabs(document.querySelector("[data-install]"), "data-install-tab", "data-install-pane");

  /* ---------------- hero REPL animation ---------------- */
  var editor = document.querySelector("[data-repl-editor]");
  var logEl = document.querySelector("[data-repl-log]");
  var ledEl = document.querySelector("[data-repl-led]");
  var boardEl = document.querySelector("[data-repl-board]");
  var runEl = document.querySelector("[data-repl-run]");
  if (!editor) return;

  var SRC = [
    "gpio.output: LED_BUILTIN", "", "to blink with n [", "  repeat n [",
    "    led.on:", "    ms: 250", "    led.off:", "    ms: 250", "  ]", "]", "", "blink: 5"
  ].join("\n");
  var BLINK_COUNT = 5, BLINK_MS = 230;

  function renderEditor(typed, caret) {
    var lines = typed.split("\n");
    var html = "";
    for (var i = 0; i < lines.length; i++) {
      var last = caret && i === lines.length - 1 ? '<span class="ed-caret on">▋</span>' : "";
      html += '<div class="ed-line"><span class="ed-ln">' + (i + 1) +
        '</span><span class="ed-src mono">' + hl(lines[i]) + last + "</span></div>";
    }
    editor.innerHTML = html;
  }
  function setRun(busy) {
    if (!runEl) return;
    runEl.classList.toggle("busy", busy);
    runEl.innerHTML = busy ? '<span class="ed-spin"></span> Running…' : '<span class="ed-run-tri"></span> Run';
  }
  function logRow(cls, text) {
    if (!logEl) return;
    var row = document.createElement("div");
    row.className = "ed-crow mono ed-" + cls;
    row.textContent = text;
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }
  function setLed(on) {
    if (ledEl) ledEl.classList.toggle("on", on);
    if (boardEl) boardEl.textContent = "LED_BUILTIN " + (on ? "ON " : "OFF");
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { renderEditor(SRC, false); setRun(false); logRow("dim", "press Run to send to the board"); return; }

  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  async function runOnce() {
    setRun(false); if (logEl) logEl.innerHTML = ""; setLed(false);
    logRow("dim", "press Run to send to the board");
    var buf = ""; renderEditor("", true);
    await wait(420);
    for (var k = 0; k < SRC.length; k++) {
      buf += SRC[k];
      renderEditor(buf, true);
      var ch = SRC[k];
      await wait(ch === "\n" ? 150 : ch === " " ? 8 : 16 + Math.random() * 34);
    }
    renderEditor(buf, false);
    await wait(640);

    setRun(true);
    if (logEl) logEl.innerHTML = "";
    logRow("dim", "▸ frothy send blink.fr · /dev/cu.usbserial-0001");
    await wait(520);
    for (var b = 0; b < BLINK_COUNT; b++) {
      setLed(true); logRow("tick", "led.on   · " + (b + 1) + "/" + BLINK_COUNT);
      await wait(BLINK_MS);
      setLed(false);
      await wait(BLINK_MS);
    }
    logRow("ok", "✓ done — blinked " + BLINK_COUNT + "× · no compile, no upload");
    setRun(false);
    await wait(2800);
  }

  (async function loop() {
    /* eslint-disable no-constant-condition */
    while (true) { await runOnce(); }
  })();
})();
