/* Frothy syntax highlighter (live lexical).
   Ported from the design prototype's tokenizer. Emits tk-* spans:
   tk-kw keyword · tk-def defined-name (after `to`) · tk-call name: · tk-ref @ref
   tk-n number/CONST · tk-s string · tk-c \ comment · tk-p punctuation · tk-w other.
   Exposes window.highlightFrothHTML(src) -> HTML string, and applies it on load to
   <pre><code class="language-frothy"> (and the legacy language-froth) blocks. */
(function () {
  var KW = new Set([
    "to", "with", "repeat", "while", "if", "else", "not", "and", "or",
    "save", "words", "show", "boot", "restore", "connect", "send", "info",
    "true", "false", "nil", "fn", "is", "set", "here", "as", "call", "cond",
    "when", "unless"
  ]);

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function span(cls, txt) { return '<span class="' + cls + '">' + esc(txt) + "</span>"; }

  var isWord = function (c) { return /[A-Za-z0-9_.?+\-*/=<>!%@]/.test(c); };
  var isWs = function (c) { return /\s/.test(c); };

  function highlightFrothHTML(src) {
    var out = "", i = 0, prev = null;
    while (i < src.length) {
      var c = src[i];
      if (isWs(c)) {
        var j = i; while (j < src.length && isWs(src[j])) j++;
        out += esc(src.slice(i, j)); i = j; continue;
      }
      if (c === '"') {                                   // string literal
        var k = src.indexOf('"', i + 1);
        var end = k === -1 ? src.length : k + 1;
        out += span("tk-s", src.slice(i, end)); i = end; prev = "str"; continue;
      }
      if (c === "\\") {                                  // \ line comment
        var nl = src.indexOf("\n", i);
        var ce = nl === -1 ? src.length : nl;
        out += span("tk-c", src.slice(i, ce)); i = ce; prev = "cmt"; continue;
      }
      if (c === "@" || c === "$") {                      // @ref / $constant slot
        var r = i + 1; while (r < src.length && isWord(src[r])) r++;
        out += span("tk-ref", src.slice(i, r)); i = r; prev = "ref"; continue;
      }
      if ("[](),;".indexOf(c) !== -1) { out += span("tk-p", c); i++; prev = c; continue; }
      if (c === ":") { out += span("tk-call", c); i++; prev = ":"; continue; }
      var w = i; while (w < src.length && isWord(src[w]) && src[w] !== ":") w++;
      if (w === i) { out += span("tk-w", src[i]); i++; prev = src[i - 1]; continue; }
      var tok = src.slice(i, w);
      var isCall = src[w] === ":";
      if (/^-?\d+(\.\d+)?$/.test(tok)) out += span("tk-n", tok);
      else if (/^[A-Z][A-Z0-9_]+$/.test(tok)) out += span("tk-n", tok);   // CONSTS e.g. LED_BUILTIN
      else if (KW.has(tok)) out += span("tk-kw", tok);
      else if (prev === "to") out += span("tk-def", tok);                  // word being defined
      else if (isCall) out += span("tk-call", tok);
      else out += span("tk-w", tok);
      prev = tok; i = w;
    }
    return out;
  }

  window.highlightFrothHTML = highlightFrothHTML;

  function paint() {
    document
      .querySelectorAll("pre code.language-frothy, pre code.language-froth")
      .forEach(function (node) {
        node.innerHTML = highlightFrothHTML(node.textContent || "");
      });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paint);
  } else {
    paint();
  }
})();
