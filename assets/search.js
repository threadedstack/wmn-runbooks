// The search page's script (ROADMAP 13.5, D-202): the only script a published site has, and only on search.html.
// It loads Pagefind from the site's own folder, searches on submit and while typing, and shows results with DOM calls
// that take text (`textContent`, `append(string)`), never markup. Pagefind's excerpt is a string with <mark> in it;
// it is parsed in an inert document and only text and <mark> elements are copied out, so nothing a document says can
// become an element, an attribute or a handler on this page.

const input = document.getElementById("site-q");
const status = document.getElementById("search-status");
const list = document.getElementById("search-results");
const MAX_PAGES = 20;
const MAX_SUBS = 3;

let pagefind = null;
let loading = null;
let seq = 0;
let timer = 0;

const say = (text) => {
  status.textContent = text;
};

/**
 * Pagefind searches the index of one language and merges others in by name. Which one is the primary is Pagefind's own
 * rule (1.5.2, pinned): the page's `lang`, else its first part, else the language with most pages (the first of equals).
 * The search page is English whatever the documents are, so every other language the index holds is merged from the same
 * folder (by its full address, or Pagefind skips it as the primary). A site in one language needs none of this.
 */
async function open(m) {
  const base = new URL("../pagefind/", import.meta.url);
  const entry = await (await fetch(new URL("pagefind-entry.json", base))).json();
  const langs = Object.entries(entry.languages ?? {});
  if (langs.length < 2) return;
  const here = (document.documentElement.getAttribute("lang") || "unknown").toLowerCase();
  const codes = langs.map(([code]) => code);
  const primary =
    [here, here.split("-")[0]].find((c) => codes.includes(c)) ??
    [...langs].sort((a, b) => b[1].page_count - a[1].page_count)[0][0];
  for (const language of codes) if (language !== primary) await m.mergeIndex(base.href, { language });
}

function load() {
  loading ??= import("../pagefind/pagefind.js")
    .then(async (m) => {
      await open(m);
      pagefind = m;
      return m;
    })
    .catch((e) => {
      loading = null;
      throw e;
    });
  return loading;
}

/** Copy an excerpt into `parent`: text stays text, `<mark>` stays a mark, everything else is flattened to its text. */
function excerptInto(parent, html) {
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${html}`, "text/html");
  for (const n of doc.body.childNodes) {
    if (n.nodeType === Node.TEXT_NODE) parent.append(n.data);
    else if (n.nodeName === "MARK") {
      const m = document.createElement("mark");
      m.textContent = n.textContent;
      parent.append(m);
    } else parent.append(n.textContent ?? "");
  }
}

/** An address from the index, only if it stays on this site. */
function sameSite(url) {
  try {
    const u = new URL(url, location.href);
    // an opaque origin ("null": a file, a data: or javascript: address) is equal to another opaque one, so check the scheme too
    return u.origin === location.origin && (u.protocol === "http:" || u.protocol === "https:") ? u.href : null;
  } catch {
    return null;
  }
}

function link(text, url, cls) {
  const href = sameSite(url);
  if (!href) return null;
  const a = document.createElement("a");
  a.setAttribute("href", href);
  a.textContent = text;
  if (cls) a.className = cls;
  return a;
}

function render(items, query, total) {
  list.replaceChildren();
  for (const d of items) {
    const li = document.createElement("li");
    li.className = "search-result";
    const title = link(d.meta?.title || d.url, d.url, "search-title");
    if (!title) continue;
    const h = document.createElement("h2");
    h.append(title);
    li.append(h);
    const p = document.createElement("p");
    p.className = "search-excerpt";
    excerptInto(p, d.excerpt ?? "");
    li.append(p);
    const subs = (d.sub_results ?? [])
      .filter((s) => s.anchor && s.url !== d.url && s.title !== d.meta?.title)
      .slice(0, MAX_SUBS);
    if (subs.length) {
      const ul = document.createElement("ul");
      ul.className = "search-subs";
      for (const s of subs) {
        const a = link(s.title || s.anchor.text || s.url, s.url, "search-sub");
        if (!a) continue;
        const item = document.createElement("li");
        item.append(a);
        const sp = document.createElement("p");
        sp.className = "search-excerpt";
        excerptInto(sp, s.excerpt ?? "");
        item.append(sp);
        ul.append(item);
      }
      li.append(ul);
    }
    list.append(li);
  }
  const shown = items.length;
  say(
    total === 0
      ? `No results for “${query}”. Try fewer or different words.`
      : `${total} ${total === 1 ? "page" : "pages"} for “${query}”${total > shown ? ` (the first ${shown} are shown)` : ""}.`,
  );
}

async function run(query) {
  const mine = ++seq;
  const q = query.trim();
  if (!q) {
    list.replaceChildren();
    say("Type a word or a phrase to search every page of this site. Use quotes for an exact phrase.");
    return;
  }
  say("Searching…");
  try {
    const pf = pagefind ?? (await load());
    const found = await pf.search(q);
    const top = found.results.slice(0, MAX_PAGES);
    const data = await Promise.all(top.map((r) => r.data()));
    if (mine !== seq) return;
    render(data, q, found.results.length);
  } catch {
    if (mine !== seq) return;
    list.replaceChildren();
    say(
      "Search could not start. It needs the site to be served over http(s) with its search index (the pagefind folder) beside it. Every page is listed below.",
    );
  }
}

function go(push) {
  const q = input.value;
  const url = new URL(location.href);
  if (q.trim()) url.searchParams.set("q", q);
  else url.searchParams.delete("q");
  try {
    if (push) history.pushState(null, "", url);
    else history.replaceState(null, "", url);
  } catch {}
  return run(q);
}

input.form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearTimeout(timer);
  go(true);
});
input.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => go(false), 200);
});
addEventListener("popstate", () => {
  input.value = new URL(location.href).searchParams.get("q") ?? "";
  run(input.value);
});

input.value = new URL(location.href).searchParams.get("q") ?? "";
run(input.value);
// Landing here to search (no query yet): the box is ready to type in. With a query the results are the point.
if (!input.value) input.focus();
