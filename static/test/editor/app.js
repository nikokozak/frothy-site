import { mountEditor } from "./vendor/frothy-editor/0.5.4/index.js";

const mount = document.getElementById("editor");
if (!mount) {
  throw new Error("#editor element missing");
}

mountEditor({
  mount,
  storageKey: "frothy-editor:sketch",
});

// Quick-start panel remembers whether the user closed it.
const help = document.getElementById("editor-help");
if (help) {
  const KEY = "frothy-editor:help-open";
  if (localStorage.getItem(KEY) === "0") help.open = false;
  help.addEventListener("toggle", () => {
    localStorage.setItem(KEY, help.open ? "1" : "0");
  });
}
