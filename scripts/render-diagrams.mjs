import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { launchBrowser } from "./browser.mjs";
const browser = await launchBrowser();
const page = await browser.newPage();
const manifest = {};
try {
  await page.setContent('<div id="diagram"></div>');
  await page.addScriptTag({ path: "node_modules/mermaid/dist/mermaid.min.js" });
  await page.evaluate(() =>
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "neutral",
      fontFamily: "Arial",
      flowchart: { htmlLabels: false, useMaxWidth: false },
      sequence: { useMaxWidth: false },
      gantt: { useMaxWidth: false },
    }),
  );
  let count = 0;
  for (const folder of ["lessons", "question-bank", "reference"]) {
    for (const name of fs.readdirSync(`content/${folder}`).sort()) {
      const text = fs
        .readFileSync(`content/${folder}/${name}`, "utf8")
        .replaceAll("\r\n", "\n");
      for (const m of text.matchAll(/```mermaid\n([\s\S]*?)\n```/g)) {
        const id = [
          ...text
            .slice(0, m.index)
            .matchAll(/(?:mermaid:id=|\*\*Figure )([A-Z0-9-]+)/g),
        ].at(-1)?.[1];
        if (!id) throw new Error(`Missing figure ID in ${name}`);
        const source = m[1];
        const svg = await page.evaluate(
          async ({ id, source }) => {
            document.querySelector("#diagram").innerHTML = "";
            const result = await mermaid.render(
              `render_${id.replaceAll("-", "_")}`,
              source,
            );
            return result.svg;
          },
          { id, source },
        );
        fs.writeFileSync(path.join("site/diagrams", `${id}.svg`), svg);
        manifest[
          crypto.createHash("sha256").update(source.trim()).digest("hex")
        ] = { id, file: `${id}.svg` };
        count++;
      }
    }
  }
  if (!count) throw new Error("No diagrams found; manifest was not replaced.");
  fs.writeFileSync(
    "site/diagrams/manifest.json",
    JSON.stringify(manifest, null, 2),
  );
  console.log(`Rendered ${count} Mermaid diagrams.`);
} finally {
  await browser.close();
}
