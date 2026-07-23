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

  function isEmptyAnchor(node) {
    return (
      node &&
      (node.tagName === "A" || node.tagName === "SPAN") &&
      node.id &&
      !textContent(node)
    );
  }

  function leadingAnchors(node) {
    var anchors = [];
    var child = node.firstElementChild;
    while (isEmptyAnchor(child)) {
      anchors.push(child);
      child = child.nextElementSibling;
    }
    return anchors;
  }

  function isSignature(node) {
    if (node.tagName !== "P") return false;
    var anchors = leadingAnchors(node);
    var first = anchors.length
      ? anchors[anchors.length - 1].nextElementSibling
      : node.firstElementChild;
    return (
      !!first &&
      first.tagName === "STRONG" &&
      first.firstElementChild &&
      first.firstElementChild.tagName === "CODE"
    );
  }

  function groupEntries(content) {
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
        var anchors = leadingAnchors(node);
        var explicitAnchor = anchors.length
          ? anchors[anchors.length - 1]
          : isEmptyAnchor(node.previousElementSibling)
            ? node.previousElementSibling
            : null;
        var explicitId = explicitAnchor ? explicitAnchor.id : "";

        current = createNode("section", "ref-entry");
        current.id = explicitId || uniqueId(textContent(node.querySelector("strong code")), seenIds);
        current.dataset.sectionTitle = currentSection;
        current.dataset.subsectionTitle = currentSubsection;
        node.parentNode.insertBefore(current, node);
        current.appendChild(node);
        node.classList.add("ref-entry-signature");
        node.tabIndex = -1;
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

  function buildCatalog(root) {
    var content = root.querySelector(".catalog-main .content");
    var list = root.querySelector("[data-catalog-list]");
    var input = root.querySelector("[data-catalog-filter]");
    var status = root.querySelector("[data-catalog-status]");
    var clear = root.querySelector("[data-catalog-clear]");
    var back = root.querySelector("[data-catalog-back]");
    var main = root.querySelector(".catalog-main");
    var noun = root.dataset.catalogNoun || "entry";
    if (!content || !list || !input || !status || !clear || !back || !main) return;

    groupEntries(content);

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

    var empty = createNode("div", "catalog-empty is-hidden");
    empty.appendChild(createNode("h2", "", "No matching " + noun + "s"));
    empty.appendChild(createNode("p", "", "Try a broader term or clear the search."));
    main.appendChild(empty);

    sections.forEach(function (section) {
      var card = createNode("section", "catalog-section");
      section.card = card;
      list.appendChild(card);

      var sectionHead = createNode("div", "catalog-section-head");
      sectionHead.appendChild(createNode("h2", "catalog-section-title", section.title));
      section.countNode = createNode("span", "catalog-section-count");
      sectionHead.appendChild(section.countNode);
      card.appendChild(sectionHead);

      section.groups.forEach(function (group) {
        if (!group.entries.length) return;
        var bucket = createNode("div", "catalog-group");
        group.bucket = bucket;
        card.appendChild(bucket);
        if (group.title) bucket.appendChild(createNode("h3", "catalog-group-title", group.title));

        var items = createNode("ul", "catalog-list");
        bucket.appendChild(items);
        group.entries.forEach(function (meta) {
          var item = createNode("li", "catalog-item-wrap");
          var link = createNode("a", "catalog-item");
          link.href = "#" + meta.id;
          link.appendChild(createNode("code", "catalog-item-name", meta.name));
          item.appendChild(link);
          items.appendChild(item);
          meta.item = item;
          meta.link = link;
          link.addEventListener("click", function (event) {
            event.preventDefault();
            select(meta, true, true);
          });
        });
      });
    });

    var active = null;

    function isMobile() {
      return window.matchMedia("(max-width: 980px)").matches;
    }

    function select(meta, updateHash, moveFocus) {
      active = meta;
      entries.forEach(function (entry) {
        var selected = entry === meta;
        entry.node.classList.toggle("is-hidden", !selected);
        entry.link.classList.toggle("is-active", selected);
        if (selected) entry.link.setAttribute("aria-current", "true");
        else entry.link.removeAttribute("aria-current");
      });
      empty.classList.toggle("is-hidden", !!meta);
      if (!meta) return;

      if (updateHash) history.pushState(null, "", "#" + meta.id);
      if (isMobile()) {
        root.classList.add("catalog-detail-open");
        back.hidden = false;
        main.scrollIntoView({ block: "start" });
      }
      if (moveFocus) {
        window.requestAnimationFrame(function () {
          meta.node.querySelector(".ref-entry-signature").focus({ preventScroll: true });
        });
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
        ? visibleEntries.length + " of " + entries.length + " " + noun + "s"
        : pluralize(entries.length, noun);
      clear.disabled = !terms.length;

      if (terms.length) {
        var query = terms.join(" ");
        var byName = function (test) {
          return visibleEntries.find(function (meta) {
            return test(normalize(meta.name));
          });
        };
        var best =
          byName(function (name) { return name === query; }) ||
          byName(function (name) { return name.indexOf(query) === 0; }) ||
          byName(function (name) { return name.indexOf(query) !== -1; }) ||
          visibleEntries[0] || null;
        if (best !== active) select(best, false, false);
      } else if (!active || !active.visible) {
        select(visibleEntries[0] || null, false, false);
      }
    }

    function selectHash() {
      var id = decodeURIComponent(window.location.hash.slice(1));
      var match = entries.find(function (meta) {
        return meta.id === id;
      });
      if (match) {
        if (!match.visible) {
          input.value = "";
          applyFilter();
        }
        select(match, false, false);
      } else {
        if (isMobile()) {
          root.classList.remove("catalog-detail-open");
          back.hidden = true;
        } else {
          select(entries.find(function (entry) { return entry.visible; }) || null, false, false);
        }
      }
    }

    input.disabled = false;
    input.addEventListener("input", applyFilter);
    clear.addEventListener("click", function () {
      input.value = "";
      input.focus();
      applyFilter();
    });
    back.addEventListener("click", function () {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      root.classList.remove("catalog-detail-open");
      back.hidden = true;
      input.focus();
      root.scrollIntoView({ block: "start" });
    });
    window.addEventListener("hashchange", selectHash);
    window.addEventListener("popstate", selectHash);

    sections.forEach(function (section) {
      section.heading.remove();
      section.groups.forEach(function (group) {
        if (group.heading) group.heading.remove();
      });
    });
    Array.from(content.children).forEach(function (node) {
      if (node.tagName === "HR") node.remove();
    });

    root.classList.add("catalog-ready");
    applyFilter();
    selectHash();
  }

  document.querySelectorAll(".reference-page").forEach(wrapTables);
  document.querySelectorAll("[data-reference-catalog]").forEach(buildCatalog);

  if (window.location.hash && !document.querySelector("[data-reference-catalog]")) {
    var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) window.setTimeout(function () { target.scrollIntoView(); }, 0);
  }
})();
