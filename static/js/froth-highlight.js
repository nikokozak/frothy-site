(function () {
  const KEYWORDS = new Set([
    "to",
    "with",
    "fn",
    "here",
    "is",
    "set",
    "if",
    "else",
    "when",
    "unless",
    "while",
    "repeat",
    "as",
    "call",
    "cond",
  ]);

  const LITERALS = new Set(["true", "false", "nil"]);

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function classify(token) {
    if (KEYWORDS.has(token)) return "tok-keyword";
    if (LITERALS.has(token)) return "tok-literal";
    if (/^-?\d+$/.test(token)) return "tok-number";
    if (/^[@A-Za-z_][A-Za-z0-9_.!?@-]*$/.test(token)) return "tok-name";
    return "";
  }

  function highlightFroth(source) {
    let out = "";
    let i = 0;

    while (i < source.length) {
      const ch = source[i];

      if (ch === "\\") {
        const start = i;
        while (i < source.length && source[i] !== "\n") i += 1;
        out += '<span class="tok-comment">' + escapeHtml(source.slice(start, i)) + "</span>";
        continue;
      }

      if (ch === '"') {
        const start = i;
        i += 1;
        while (i < source.length) {
          if (source[i] === "\\" && i + 1 < source.length) {
            i += 2;
            continue;
          }
          if (source[i] === '"') {
            i += 1;
            break;
          }
          i += 1;
        }
        out += '<span class="tok-string">' + escapeHtml(source.slice(start, i)) + "</span>";
        continue;
      }

      if (/\s/.test(ch)) {
        out += escapeHtml(ch);
        i += 1;
        continue;
      }

      const start = i;
      while (i < source.length && !/\s/.test(source[i]) && source[i] !== "\\" && source[i] !== '"') {
        i += 1;
      }
      const token = source.slice(start, i);
      const klass = classify(token);
      if (klass) {
        out += '<span class="' + klass + '">' + escapeHtml(token) + "</span>";
      } else {
        out += escapeHtml(token);
      }
    }

    return out;
  }

  document
    .querySelectorAll("pre code.language-froth, pre code.language-frothy")
    .forEach(function (node) {
      node.innerHTML = highlightFroth(node.textContent || "");
    });
})();
