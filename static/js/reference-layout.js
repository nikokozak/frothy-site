(function () {
  function slugify(value) {
    return (value || "")
      .toLowerCase()
      .trim()
      .replace(/[`']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalize(value) {
    return (value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function textContent(node) {
    return (node && node.textContent ? node.textContent : "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function pluralize(count, noun) {
    return count + " " + noun + (count === 1 ? "" : "s");
  }

  function createNode(tagName, className, value) {
    var node = document.createElement(tagName);
    if (className) node.className = className;
    if (typeof value === "string") node.textContent = value;
    return node;
  }

  function uniqueId(value, seen) {
    var base = slugify(value) || "entry";
    var count = seen[base] || 0;
    seen[base] = count + 1;
    return count ? base + "-" + (count + 1) : base;
  }

  function wrapTables(root) {
    root.querySelectorAll("table").forEach(function (table) {
      if (table.parentElement && table.parentElement.classList.contains("ref-table-wrap")) return;
      var wrap = createNode("div", "ref-table-wrap");
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function isSignature(node) {
    var first = node.firstElementChild;
    if (first && first.tagName === "A" && first.id && !textContent(first)) {
      first = first.nextElementSibling;
    }
    return (
      node.tagName === "P" &&
      first &&
      first.tagName === "STRONG" &&
      first.firstElementChild &&
      first.firstElementChild.tagName === "CODE"
    );
  }

  function groupWordEntries(root) {
    var content = root.querySelector(".content");
    if (!content) return;

    var current = null;
    var currentSection = "";
    var currentSubsection = "";
    var seenIds = Object.create(null);

    Array.from(content.children).forEach(function (node) {
      if (node.tagName === "H2") {
        current = null;
        currentSection = textContent(node);
        currentSubsection = "";
        if (!node.id) node.id = uniqueId(currentSection, seenIds);
        return;
      }

      if (node.tagName === "H3") {
        current = null;
        currentSubsection = textContent(node);
        if (!node.id) node.id = uniqueId(currentSection + " " + currentSubsection, seenIds);
        return;
      }

      if (node.tagName === "HR") {
        current = null;
        return;
      }

      if (isSignature(node)) {
        var inlineAnchor =
          node.firstElementChild &&
          node.firstElementChild.tagName === "A" &&
          node.firstElementChild.id &&
          !textContent(node.firstElementChild)
            ? node.firstElementChild
            : null;
        var explicitAnchor = inlineAnchor || node.previousElementSibling;
        var explicitId =
          explicitAnchor &&
          explicitAnchor.tagName === "A" &&
          explicitAnchor.id &&
          !textContent(explicitAnchor)
            ? explicitAnchor.id
            : "";

        current = createNode("section", "ref-entry");
        current.id = explicitId || uniqueId(textContent(node.querySelector("strong code")), seenIds);
        current.dataset.sectionTitle = currentSection;
        current.dataset.subsectionTitle = currentSubsection;
        node.parentNode.insertBefore(current, node);
        current.appendChild(node);
        node.classList.add("ref-entry-signature");
        if (explicitId) explicitAnchor.remove();

        var badge = node.querySelector("em");
        if (badge) {
          badge.classList.add("ref-entry-badge");
          badge.textContent = badge.textContent.replace(/[()]/g, "").trim();
        }
        return;
      }

      if (!current) return;
      current.appendChild(node);
      if (node.tagName === "P" && /^(Example|Definition)$/.test(textContent(node))) {
        node.remove();
      }
    });
  }

  function entryMeta(entry) {
    var signature = entry.querySelector(".ref-entry-signature");
    if (!signature) return null;

    var stack = Array.from(signature.children)
      .filter(function (child) {
        return child.tagName === "CODE";
      })
      .pop();
    var summary = "";

    Array.from(entry.children).some(function (child) {
      if (child.tagName !== "P" || child === signature) return false;
      summary = textContent(child);
      return !!summary;
    });

    return {
      id: entry.id,
      name: textContent(signature.querySelector("strong code")),
      kind: textContent(signature.querySelector(".ref-entry-badge")),
      stack: textContent(stack),
      summary: summary,
      node: entry,
      item: null,
      link: null,
      visible: true
    };
  }

  function buildWordBrowser(root) {
    if (!root.hasAttribute("data-word-catalog")) return;

    var content = root.querySelector(".content");
    var firstHeading = content && content.querySelector("h2");
    if (!content || !firstHeading) return;

    var sections = [];
    var entries = [];
    var currentSection = null;
    var currentGroup = null;

    Array.from(content.children).forEach(function (node) {
      if (node.tagName === "H2") {
        currentSection = {
          title: textContent(node),
          heading: node,
          groups: [],
          card: null,
          countNode: null
        };
        currentGroup = { title: "", heading: null, entries: [], bucket: null };
        currentSection.groups.push(currentGroup);
        sections.push(currentSection);
        return;
      }

      if (node.tagName === "H3" && currentSection) {
        currentGroup = { title: textContent(node), heading: node, entries: [], bucket: null };
        currentSection.groups.push(currentGroup);
        return;
      }

      if (!node.classList || !node.classList.contains("ref-entry") || !currentSection) return;
      var meta = entryMeta(node);
      if (!meta) return;

      meta.section = currentSection;
      meta.group = currentGroup;
      meta.searchText = normalize([
        meta.name,
        meta.kind,
        meta.stack,
        meta.summary,
        currentSection.title,
        currentGroup.title
      ].join(" "));
      currentGroup.entries.push(meta);
      entries.push(meta);
    });

    sections = sections.filter(function (section) {
      return section.groups.some(function (group) {
        return group.entries.length;
      });
    });
    if (!entries.length) return;

    var browser = createNode("section", "words-browser");
    browser.setAttribute("data-words-browser", "true");

    var toolbar = createNode("div", "words-browser-toolbar");
    browser.appendChild(toolbar);

    var field = createNode("label", "words-browser-filter");
    field.setAttribute("for", "words-filter");
    field.appendChild(createNode("span", "words-browser-filter-label", "Search all words"));
    toolbar.appendChild(field);

    var input = createNode("input", "");
    input.id = "words-filter";
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "Name, module, signature, or description";
    field.appendChild(input);

    var toolbarMeta = createNode("div", "words-browser-toolbar-meta");
    toolbar.appendChild(toolbarMeta);
    var status = createNode("p", "words-browser-status", pluralize(entries.length, "word"));
    status.setAttribute("aria-live", "polite");
    toolbarMeta.appendChild(status);
    var clear = createNode("button", "words-browser-clear", "Clear");
    clear.type = "button";
    clear.disabled = true;
    toolbarMeta.appendChild(clear);

    var grid = createNode("div", "words-browser-grid");
    browser.appendChild(grid);
    var catalog = createNode("nav", "words-browser-catalog");
    catalog.setAttribute("aria-label", "All Frothy words");
    grid.appendChild(catalog);
    var detail = createNode("div", "words-browser-detail");
    detail.setAttribute("aria-live", "polite");
    grid.appendChild(detail);

    var empty = createNode("div", "words-browser-empty is-hidden");
    empty.appendChild(createNode("h3", "", "No matching words"));
    empty.appendChild(createNode("p", "", "Try a broader term or clear the search."));
    detail.appendChild(empty);

    sections.forEach(function (section) {
      var card = createNode("section", "words-browser-section");
      section.card = card;
      catalog.appendChild(card);

      var sectionHead = createNode("div", "words-browser-section-head");
      sectionHead.appendChild(createNode("h3", "words-browser-section-title", section.title));
      section.countNode = createNode("span", "words-browser-section-count");
      sectionHead.appendChild(section.countNode);
      card.appendChild(sectionHead);

      section.groups.forEach(function (group) {
        if (!group.entries.length) return;
        var bucket = createNode("div", "words-browser-group");
        group.bucket = bucket;
        card.appendChild(bucket);
        if (group.title) bucket.appendChild(createNode("h4", "words-browser-group-title", group.title));

        var list = createNode("ul", "words-browser-list");
        bucket.appendChild(list);
        group.entries.forEach(function (meta) {
          var item = createNode("li", "words-browser-item-wrap");
          var link = createNode("a", "words-browser-item");
          link.href = "#" + meta.id;
          link.appendChild(createNode("code", "words-browser-word-name", meta.name));
          item.appendChild(link);
          list.appendChild(item);
          meta.item = item;
          meta.link = link;
          link.addEventListener("click", function (event) {
            event.preventDefault();
            select(meta, true);
          });
        });
      });
    });

    var active = null;

    function select(meta, updateHash) {
      active = meta;
      entries.forEach(function (entry) {
        var selected = entry === meta;
        entry.node.classList.toggle("is-hidden", !selected);
        entry.link.classList.toggle("is-active", selected);
        if (selected) entry.link.setAttribute("aria-current", "true");
        else entry.link.removeAttribute("aria-current");
      });
      empty.classList.toggle("is-hidden", !!meta);
      if (meta && updateHash) history.pushState(null, "", "#" + meta.id);
      if (meta && window.matchMedia("(max-width: 720px)").matches) {
        detail.scrollIntoView({ block: "start" });
      }
    }

    function applyFilter() {
      var terms = normalize(input.value).split(" ").filter(Boolean);
      var visibleEntries = entries.filter(function (meta) {
        meta.visible = !terms.length || terms.every(function (term) {
          return meta.searchText.indexOf(term) !== -1;
        });
        meta.item.classList.toggle("is-hidden", !meta.visible);
        return meta.visible;
      });

      sections.forEach(function (section) {
        var visibleCount = 0;
        section.groups.forEach(function (group) {
          var groupCount = group.entries.filter(function (meta) {
            return meta.visible;
          }).length;
          if (group.bucket) group.bucket.classList.toggle("is-hidden", groupCount === 0);
          visibleCount += groupCount;
        });
        section.card.classList.toggle("is-hidden", visibleCount === 0);
        section.countNode.textContent = visibleCount;
      });

      status.textContent = terms.length
        ? visibleEntries.length + " of " + entries.length + " words"
        : pluralize(entries.length, "word");
      clear.disabled = !terms.length;
      if (!active || !active.visible) select(visibleEntries[0] || null, false);
    }

    function selectHash() {
      var id = decodeURIComponent(window.location.hash.slice(1));
      var match = entries.find(function (meta) {
        return meta.id === id;
      });
      if (!match) return;
      if (!match.visible) {
        input.value = "";
        applyFilter();
      }
      select(match, false);
    }

    input.addEventListener("input", applyFilter);
    clear.addEventListener("click", function () {
      input.value = "";
      input.focus();
      applyFilter();
    });
    window.addEventListener("hashchange", selectHash);

    content.insertBefore(browser, firstHeading);
    entries.forEach(function (meta) {
      detail.appendChild(meta.node);
    });
    sections.forEach(function (section) {
      section.heading.remove();
      section.groups.forEach(function (group) {
        if (group.heading) group.heading.remove();
      });
    });
    Array.from(content.children).forEach(function (node) {
      if (node.tagName === "HR") node.remove();
    });

    applyFilter();
    selectHash();
  }

  document.querySelectorAll(".reference-page").forEach(function (page) {
    wrapTables(page);
    groupWordEntries(page);
    buildWordBrowser(page);
  });

  if (window.location.hash && !document.querySelector("[data-word-catalog]")) {
    var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) window.setTimeout(function () { target.scrollIntoView(); }, 0);
  }
})();
