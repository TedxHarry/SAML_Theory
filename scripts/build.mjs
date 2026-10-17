import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import MarkdownIt from "markdown-it";
import GithubSlugger from "github-slugger";

const root = process.cwd();
const out = path.join(root, "docs");
const base = "/SAML_Theory/";
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const hash = (s) => crypto.createHash("sha256").update(s.trim()).digest("hex");
const manifest = JSON.parse(
  fs.readFileSync("site/diagrams/manifest.json", "utf8"),
);
const design = JSON.parse(fs.readFileSync("DESIGN.md", "utf8").split("---")[1]);
const uiVersion = hash(
  fs.readFileSync("site/style.css", "utf8") +
    fs.readFileSync("site/app.js", "utf8") +
    JSON.stringify(design),
).slice(0, 12);
const config = {
  lessons: [
    [
      "why-saml-exists",
      "Why SAML exists",
      "Understand authentication, accounts, access and the browser journey.",
    ],
    [
      "planning-and-metadata",
      "Planning and metadata",
      "Read the agreement, endpoints, entity IDs and trusted configuration.",
    ],
    [
      "sp-initiated-sso",
      "SP-initiated sign-in",
      "Follow requests, responses and the context that connects them.",
    ],
    [
      "responses-assertions-and-identity",
      "Responses and identity",
      "Read assertions, identifiers, attributes and account matching.",
    ],
    [
      "bindings-relaystate-and-alternative-paths",
      "Bindings and alternative paths",
      "Compare browser delivery, RelayState, artifacts and brokered sign-in.",
    ],
    [
      "trust-signatures-and-encryption",
      "Trust and protection",
      "Connect signatures and encryption to trusted keys and actual content.",
    ],
    [
      "response-acceptance-and-access",
      "Response acceptance",
      "Explain each acceptance boundary and the application decisions after it.",
    ],
    [
      "sessions-reauthentication-and-logout",
      "Sessions and logout",
      "Separate session clocks, reauthentication and supported logout scope.",
    ],
    [
      "integration-design-and-change-planning",
      "Integration design and changes",
      "Review requirements, plan tests and prepare a useful handover.",
    ],
    [
      "troubleshooting-and-engineering-casework",
      "Troubleshooting and casework",
      "Investigate evidence, distinguish causes and defend a correction.",
    ],
  ],
  references: [
    [
      "glossary",
      "Glossary",
      "Look up a term and the distinction that matters.",
    ],
    [
      "field-comparison-and-message-anatomy",
      "Fields and message anatomy",
      "Find the right XML location and interpret its meaning.",
    ],
    [
      "binding-comparison",
      "Bindings and message delivery",
      "Compare Redirect, POST, Artifact and RelayState.",
    ],
    [
      "trust-and-protection",
      "Trust and protection",
      "Signing, encryption, key ownership and lifecycle.",
    ],
    [
      "response-validation-and-acceptance",
      "Response acceptance",
      "Trust, targets, time, correlation and application entry.",
    ],
    [
      "sessions-reauthentication-and-logout",
      "Sessions and logout",
      "Independent state, reauthentication and confirmed outcomes.",
    ],
    [
      "common-misconceptions",
      "Common misconceptions",
      "Revisit assumptions that lead to the wrong diagnosis.",
    ],
    [
      "troubleshooting-evidence",
      "Troubleshooting evidence",
      "Associate records without confusing what they establish.",
    ],
    [
      "integration-planning-changes-and-handover",
      "Planning and handover",
      "Reuse the test matrix and integration handover template.",
    ],
    [
      "sources-and-further-reading",
      "Sources and further reading",
      "Find official documentation for the question at hand.",
    ],
    [
      "specialized-awareness",
      "Specialized capabilities",
      "Recognize less common features and know when to investigate.",
    ],
  ],
};

const documents = [];
config.lessons.forEach(([slug, title, description], i) => {
  const number = String(i + 1).padStart(2, "0");
  documents.push({
    source: `lessons/lesson-${number}-${slug}.md`,
    route: `lessons/lesson-${number}-${slug}/`,
    title,
    description,
    kind: "Lesson",
    number: i + 1,
  });
  documents.push({
    source: `question-bank/lesson-${number}.md`,
    route: `questions/lesson-${number}/`,
    title: `${title}: questions`,
    description: `Practice Lesson ${i + 1} with independent scenarios and expandable explanations.`,
    kind: "Questions",
    number: i + 1,
  });
});
config.references.forEach(([slug, title, description]) =>
  documents.push({
    source: `reference/${slug}.md`,
    route: `reference/${slug}/`,
    title,
    description,
    kind: "Reference",
  }),
);
const bySource = new Map(documents.map((d) => [d.source, d]));
const lessonDocs = documents.filter((d) => d.kind === "Lesson");
const questions = documents.filter((d) => d.kind === "Questions");
const refs = documents.filter((d) => d.kind === "Reference");
const sourceTexts = new Map(
  documents.map((d) => [
    d.source,
    fs
      .readFileSync(path.join("content", d.source), "utf8")
      .replaceAll("\r\n", "\n"),
  ]),
);
const countQuestions = (d) =>
  [...sourceTexts.get(d.source).matchAll(/^## \d+\./gm)].length;

fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(path.join(out, "assets"), { recursive: true });
fs.cpSync("site/fonts", path.join(out, "assets/fonts"), { recursive: true });
fs.cpSync("site/diagrams", path.join(out, "assets/diagrams"), {
  recursive: true,
});
for (const file of ["style.css", "app.js"])
  fs.copyFileSync(`site/${file}`, path.join(out, "assets", file));
const vars = Object.entries(design.colors)
  .map(([k, v]) => `--${k}:${v};`)
  .join("");
fs.writeFileSync(
  path.join(out, "assets/tokens.css"),
  `:root{${vars}--sans:${design.typography.sans.fontFamily};--serif:${design.typography.serif.fontFamily};--mono:${design.typography.mono.fontFamily};--radius:${design.rounded.DEFAULT};--radius-sm:${design.rounded.sm};--radius-lg:${design.rounded.lg};--page-max:${design.spacing["page-max"]};--border:color-mix(in srgb,var(--ink) 15%,white);}`,
);

function link(target, current) {
  if (/^(https?:|mailto:|#)/.test(target)) return target;
  const [file, fragment] = target.split("#");
  const source = path.posix.normalize(
    path.posix.join(path.posix.dirname(current), file),
  );
  const doc = bySource.get(source);
  if (!doc) throw new Error(`Unmapped course link: ${current} -> ${target}`);
  return base + doc.route + (fragment ? `#${fragment}` : "");
}

function render(d) {
  const text = sourceTexts.get(d.source);
  const headings = [];
  const slugger = new GithubSlugger();
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
  const tokens = md.parse(text, {});
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === "heading_open") {
      const inline = tokens[i + 1];
      const title = inline.children.map((c) => c.content).join("");
      const id = slugger.slug(title);
      t.attrSet("id", id);
      if (t.tag === "h2") headings.push({ id, title });
    }
    if (t.type === "inline") {
      for (const child of t.children ?? []) {
        if (child.type === "link_open")
          child.attrSet("href", link(child.attrGet("href"), d.source));
      }
    }
  }
  md.renderer.rules.table_open = () =>
    '<div class="table-scroll" role="region" aria-label="Comparison table" tabindex="0"><table>\n';
  md.renderer.rules.table_close = () => "</table></div>\n";
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (ts, i, opts, env, self) => {
    const t = ts[i];
    if (t.info.trim() !== "mermaid") return fence(ts, i, opts, env, self);
    const entry = manifest[hash(t.content)];
    if (!entry)
      throw new Error(
        `Diagram changed in ${d.source}. Run npm run diagrams first.`,
      );
    const prefix = text.split("\n").slice(0, t.map[0]).join("\n");
    const captions = [...prefix.matchAll(/\*\*Figure ([^*]+)\*\*/g)];
    const label = captions.at(-1)?.[1].replace(/\.$/, "") ?? entry.id;
    const file = `${base}assets/diagrams/${entry.file}`;
    const svg = fs.readFileSync(path.join("site/diagrams", entry.file), "utf8");
    const box = svg.match(/viewBox="[^"]*?([\d.]+) ([\d.]+)"/);
    const dimensions = box
      ? ` width="${Math.ceil(Number(box[1]))}" height="${Math.ceil(Number(box[2]))}"`
      : "";
    return `<figure class="diagram"><img src="${file}" alt="${escape(label)}"${dimensions} loading="lazy"><figcaption><span>${escape(label.split(":")[0])}</span><a href="${file}" data-diagram="${escape(label)}">Open full diagram</a></figcaption></figure>`;
  };
  return { html: md.renderer.render(tokens, md.options, {}), headings };
}

function shell(title, route, content, current) {
  const active = (r) => (route === r ? ' aria-current="page"' : "");
  const nav = lessonDocs
    .map(
      (d) =>
        `<li><a href="${base + d.route}"${current?.number === d.number ? ' aria-current="page"' : ""}><span class="lesson-number">${String(d.number).padStart(2, "0")}</span><span>${escape(d.title)}</span></a></li>`,
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(current?.description ?? "Learn SAML with Okta through complete diagrams, connected explanations and engineering casework.")}"><meta name="color-scheme" content="light"><title>${escape(title)} | SAML Theory</title><link rel="canonical" href="https://tedxharry.github.io${base + route}"><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/tokens.css?v=${uiVersion}"><link rel="stylesheet" href="${base}assets/style.css?v=${uiVersion}"><script src="${base}assets/app.js?v=${uiVersion}" defer></script></head><body><a class="skip" href="#main">Skip to content</a><header class="topbar"><a class="brand" href="${base}"><span class="brand-mark" aria-hidden="true"></span>SAML Theory</a><nav class="toplinks" aria-label="Primary"><a href="${base}"${active("")}>Course</a><a href="${base}reference/"${route.startsWith("reference/") ? ' aria-current="page"' : ""}>Reference</a><a href="${base}search/"${active("search/")}>Search</a><a class="repo-link" href="https://github.com/TedxHarry/SAML_Theory">GitHub ↗</a></nav></header><div class="shell"><aside class="sidebar"><details class="course-menu" open><summary title="Expand or collapse lessons"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-label">Browse lessons</span></summary><p class="nav-label">SAML with Okta</p><nav aria-label="Lessons"><ol class="lesson-nav">${nav}</ol></nav><a class="side-ref" href="${base}reference/">Reference library →</a><p class="sidebar-note">Read the explanation.<br>Trace the exchange.<br>Explain the decision.</p></details></aside><main id="main" class="main">${content}<footer class="page-footer">SAML with Okta · <a href="${base}reference/sources-and-further-reading/">Official sources</a> · <a href="https://github.com/TedxHarry/SAML_Theory">Course source</a></footer></main></div><dialog id="diagram-dialog" aria-labelledby="diagram-title"><div class="dialog-head"><h2 id="diagram-title">Full diagram</h2><form method="dialog" novalidate><button type="submit" id="close-diagram">Close diagram</button></form></div><div class="diagram-scroll"><img id="full-diagram" alt=""></div></dialog></body></html>`;
}
function write(route, html) {
  const dir = path.join(out, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

for (const d of documents) {
  const { html } = render(d);
  const n = d.number;
  const modes = n
    ? `<nav class="reading-modes" aria-label="Lesson material"><a href="${base + lessonDocs[n - 1].route}"${d.kind === "Lesson" ? ' aria-current="page"' : ""}>Lesson ${n}</a><a href="${base + questions[n - 1].route}"${d.kind === "Questions" ? ' aria-current="page"' : ""}>Questions <span>(${countQuestions(questions[n - 1])})</span></a></nav>`
    : `<div class="eyebrow">Reference library</div>`;
  const prevNext = n
    ? `<nav class="page-navigation" aria-label="Lesson sequence">${n > 1 ? `<a href="${base + lessonDocs[n - 2].route}"><small>← Previous lesson</small>${escape(lessonDocs[n - 2].title)}</a>` : "<span></span>"}${n < 10 ? `<a href="${base + lessonDocs[n].route}"><small>Next lesson →</small>${escape(lessonDocs[n].title)}</a>` : `<a href="${base}reference/"><small>Keep nearby →</small>Reference library</a>`}</nav>`
    : "";
  write(
    d.route,
    shell(
      d.title,
      d.route,
      `<div class="reading-layout"><section>${modes}<article class="prose">${html}</article>${prevNext}</section></div>`,
      d,
    ),
  );
}

const rows = lessonDocs
  .map(
    (d) =>
      `<a class="course-row" href="${base + d.route}"><span class="num">${String(d.number).padStart(2, "0")}</span><span><strong>${escape(d.title)}</strong><p>${escape(d.description)}</p></span><span class="row-arrow" aria-hidden="true">→</span></a>`,
  )
  .join("");
write(
  "",
  shell(
    "Learn SAML with Okta",
    "",
    `<div class="home"><section class="hero"><div><div class="eyebrow">SAML with Okta · Theory course</div><h1>Understand the exchange.<br>Think like an engineer.</h1><p class="intro">Follow Devi from her browser to Okta and into Atlas. Learn what each message means, why an application accepts it, and how to investigate when the journey stops.</p><a class="primary-link" href="${base + lessonDocs[0].route}">Start with Lesson 1 <span aria-hidden="true">→</span></a></div><div class="connection" aria-label="Three recurring participants"><div>Browser<small>The visible journey</small></div><div>Okta<small>Identity provider</small></div><div>Application<small>Trust and access</small></div></div></section><section aria-labelledby="course-outline"><div class="section-heading"><h2 id="course-outline">Your learning path</h2><small>10 lessons · Questions for every lesson</small></div><div class="course-list">${rows}</div></section><section class="reference-link"><strong>Need a field, flow or troubleshooting reminder?</strong><p>Use the reference library for message anatomy, trust, sessions, test planning and official sources.</p><a href="${base}reference/">Open the reference library →</a></section></div>`,
  ),
);
write(
  "reference/",
  shell(
    "Reference library",
    "reference/",
    `<div class="home"><div class="eyebrow">Keep nearby</div><div class="prose"><h1>Reference library</h1><p>Find the distinction, field or evidence you need without rereading an entire lesson.</p></div><div class="reference-grid">${refs.map((d) => `<a href="${base + d.route}"><strong>${escape(d.title)}</strong><small>${escape(d.description)}</small></a>`).join("")}</div></div>`,
  ),
);
const index = documents.map((d) => ({
  title: d.title,
  kind: d.kind,
  url: base + d.route,
  description: d.description,
  text: sourceTexts
    .get(d.source)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\s]+/g, " "),
}));
write(
  "search/",
  shell(
    "Search the course",
    "search/",
    `<div class="home"><div class="eyebrow">Find an explanation</div><div class="prose"><h1>Search the course</h1><p>Search lessons, questions and references. Try “RelayState”, “NameID” or “logout”.</p></div><label for="course-search" class="search-label">Search terms</label><div class="search-controls"><input type="search" id="course-search" autocomplete="off" placeholder="Search SAML with Okta"><button id="clear-search" type="button" onclick="document.querySelector('#course-search').value='';document.querySelector('#course-search').dispatchEvent(new Event('input'));document.querySelector('#course-search').focus()" hidden>Clear search</button></div><p id="search-count" class="search-count" role="status">Browse all ${documents.length} course pages below.</p><div id="no-results" class="empty" hidden>No matching pages. Try a shorter term, or browse the reference library.</div><ul class="search-results" id="search-results">${index.map((d) => `<li><small>${d.kind}</small><a href="${d.url}">${escape(d.title)}</a><p>${escape(d.description)}</p></li>`).join("")}</ul><script type="application/json" id="search-data">${JSON.stringify(index).replaceAll("<", "\\u003c")}</script><noscript><p>Search filtering requires JavaScript. All course links remain available above.</p></noscript></div>`,
  ),
);
fs.writeFileSync(
  path.join(out, "404.html"),
  shell(
    "Page not found",
    "404.html",
    `<div class="home prose"><div class="eyebrow">Page not found</div><h1>Let’s get you back to the course.</h1><p>This address does not point to a course page. Browse the lessons or search for the topic you need.</p><p><a href="${base}">Open the course outline</a> · <a href="${base}search/">Search the course</a></p></div>`,
  ),
);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
fs.writeFileSync(
  path.join(out, "assets/favicon.svg"),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#245bc4"/><circle cx="18" cy="18" r="10" fill="none" stroke="white" stroke-width="3"/><circle cx="29" cy="29" r="5" fill="#14746f" stroke="white" stroke-width="2"/></svg>',
);
fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["", "reference/", "search/", ...documents.map((d) => d.route)].map((r) => `<url><loc>https://tedxharry.github.io${base + r}</loc></url>`).join("")}</urlset>`,
);
fs.writeFileSync(
  path.join(out, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://tedxharry.github.io/SAML_Theory/sitemap.xml\n",
);
fs.writeFileSync(
  path.join(out, "build-manifest.json"),
  JSON.stringify(
    {
      base,
      documents: documents.map((d) => ({
        ...d,
        questions: d.kind === "Questions" ? countQuestions(d) : undefined,
      })),
      diagrams: Object.values(manifest).length,
    },
    null,
    2,
  ),
);
console.log(
  `Built ${documents.length} reading pages plus course, reference, search and 404 pages.`,
);
