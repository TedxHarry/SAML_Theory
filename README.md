# SAML Theory with Okta

A theory course for beginners developing practical SAML engineering judgment. Follow complete browser exchanges, interpret messages, distinguish trust from delivery, and investigate application outcomes using evidence.

**[Read the course](https://tedxharry.github.io/SAML_Theory/)** · **[Reference library](https://tedxharry.github.io/SAML_Theory/reference/)**

## Course material

- **10 lessons:** foundations, metadata, SP-initiated SSO, identity, bindings, trust, acceptance, sessions, integration planning and troubleshooting.
- **155 independent questions:** each with its own expandable teaching explanation.
- **200 interactive quiz questions:** 20 per lesson, including 30 evidence packets and 20 reasoning prompts, with shuffled options, immediate explanations and an optional retry of currently missed questions.
- **16 reference and practice files:** includes 12 cumulative review cases, annotated request/response XML, an Okta settings bridge, troubleshooting comparisons and a final engineering case.
- **67 diagram placements:** progressive sequences, decision flows, timelines, message structure and trust relationships, including a reused complete exchange in the final case.

The recurring examples use Devi, Northstar Research, Okta Identity Engine, Atlas and Ledger. Addresses and evidence packets are fictional. The course distinguishes SAML rules, documented product capabilities and actual receiver outcomes. It is theory and engineering preparation, with live implementation testing outside the material's verification scope.

## Repository layout

| Path | Purpose |
| --- | --- |
| `content/lessons/` | Editable lesson Markdown. |
| `content/question-bank/` | Independent scenarios and explanations. |
| `content/quizzes/` | Self-contained multiple-choice questions, stable answer IDs and per-option teaching explanations. |
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

The checks cover generated routes and anchors, diagram assets, all question explanations, desktop/mobile navigation, search restoration and empty results, diagram Escape/focus behavior, independently open answers, a custom 404 page, no-JavaScript fallback and automated accessibility checks. Quiz checks cover all 800 choices under reordered options, correct and incorrect inline feedback, independent state, keyboard selection and option shuffling. Automated accessibility results do not replace assistive-technology or learner testing.

## Update a quiz

Edit the lesson's JSON file in `content/quizzes/`. Each question has a unique ID, topic, independent prompt, four options and a `correctId` matching one option ID. Every option needs an explanation. Supply enough context inside the question to answer it without opening a lesson. Use plausible misconceptions as distractors and preserve the distinction between protocol rules and product capabilities.

Grading uses stable option IDs. Options are shuffled separately for every question on each page visit, so changing their display position cannot change the correct answer. Selecting another option updates only that question's feedback. Retry missed questions resets only the currently incorrect selections, guarantees a different option order and keeps other answers. The answered count records exploration rather than a pass/fail grade. Choices are not saved across visits or sent to a server. Optional `evidence` arrays supply packet observations; `reasoning` supplies a pause-before-selection prompt, without collecting or grading a written response. Without JavaScript, native disclosures reveal the correct answer and every explanation.

Run the build, checks and tests above after editing. They validate the data contract and behavior; a human content review is still needed for technical accuracy and unambiguous choices.

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

The course, questions and ordinary navigation work without JavaScript. JavaScript adds local search filtering, an enlarged diagram dialog and interactive quiz grading; diagram links and quiz answer disclosures remain available without it. Search and quizzes run locally and do not send queries or answers to a service.

Manrope and Source Serif 4 are self-hosted. Their respective Open Font License files are included with the font assets.
