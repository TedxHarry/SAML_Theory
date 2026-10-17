# SAML Theory with Okta

A theory course for beginners developing practical SAML engineering judgment. Follow complete browser exchanges, interpret messages, distinguish trust from delivery, and investigate application outcomes using evidence.

**[Read the course](https://tedxharry.github.io/SAML_Theory/)** · **[Reference library](https://tedxharry.github.io/SAML_Theory/reference/)**

## Course material

- **10 lessons:** foundations, metadata, SP-initiated SSO, identity, bindings, trust, acceptance, sessions, integration planning and troubleshooting.
- **155 independent questions:** each with its own expandable teaching explanation.
- **11 reference and appendix files:** fields, bindings, protection, acceptance, sessions, misconceptions, evidence, planning, glossary, sources and specialized recognition.
- **66 diagram placements:** progressive sequences, decision flows, timelines, message structure and trust relationships.

The recurring examples use Devi, Northstar Research, Okta Identity Engine, Atlas and Ledger. Addresses and evidence packets are fictional. The course distinguishes SAML rules, documented product capabilities and actual receiver outcomes. It is theory and engineering preparation, with live implementation testing outside the material's verification scope.

## Repository layout

| Path | Purpose |
| --- | --- |
| `content/lessons/` | Editable lesson Markdown. |
| `content/question-bank/` | Independent scenarios and explanations. |
| `content/reference/` | Reusable lookup material and awareness appendix. |
| `site/` | Shared styles, reading behavior, local fonts and SVG diagrams. |
| `scripts/` | Static build, diagram rendering, local preview and link checks. |
| `tests/` | Browser behavior and automated accessibility checks. |
| `docs/` | Generated website published by GitHub Pages. |
| `planning/` | Authoring documents and the pre-publication course review. These are not website routes. |
| `DESIGN.md` | Visual tokens and the reading-interface contract. |

## Build and preview

Use Node.js 22 or newer.

```sh
npm ci
npm run build
npm run check
npm run serve
```

Open `http://127.0.0.1:4173/SAML_Theory/`. The project prefix is intentional: links are checked against the same base path used by GitHub Pages.

## Check changes

```sh
npm run build
npm run check
npm test
```

The browser tests use installed Google Chrome on Windows. On other platforms, install the Playwright browser with `npx playwright install chromium`, or set `BROWSER_EXECUTABLE` to an available Chromium browser. Reports and screenshots are written to the ignored `test-results/` directory.

The checks cover generated routes and anchors, diagram assets, all question explanations, desktop/mobile navigation, search restoration and empty results, diagram Escape/focus behavior, independently open answers, a custom 404 page, no-JavaScript fallback and automated accessibility checks. Automated accessibility results do not replace assistive-technology or learner testing.

## Update a diagram

Edit its Mermaid fence in the appropriate Markdown source, then run:

```sh
npm run diagrams
npm run build
npm run check
npm test
```

The build checks each diagram source against a SHA-256 manifest. A changed source without a refreshed SVG fails the build rather than silently serving the old illustration. Review the full-size rendered diagram after changing its source. Mermaid is a build dependency; readers receive local SVG images rather than loading a diagram library.

## Publish

GitHub Pages uses the `docs/` directory on `main`. Commit both source changes and regenerated website files, then push `main`. No custom deployment credentials are stored in this repository. The `.nojekyll` file preserves the prebuilt static site.

The course, questions and ordinary navigation work without JavaScript. JavaScript adds local search filtering and an enlarged diagram dialog; the diagram links still open their SVG images without it. Search runs locally and does not send queries to a service.

Manrope and Source Serif 4 are self-hosted. Their respective Open Font License files are included with the font assets.
