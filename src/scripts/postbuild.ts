import { zodToJsonSchema } from "zod-to-json-schema";
import * as fs from "fs";
import { z } from "zod";
import path from "path";
import { glob } from "glob";
import { defaultComponents } from "../components/default-components.js";
import { baseSpecSchema } from "../generate/base-spec-schema.js";

// Function to recursively remove all "required" fields from a JSON schema
function removeRequiredFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeRequiredFields);
  }
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== "required") {
        result[key] = removeRequiredFields(value);
      }
    }
    return result;
  }
  return obj;
}

await fs.promises.mkdir("lib", { recursive: true });

const stylesSchema = z.object({
  styles: z
    .record(
      z.enum(Object.values(defaultComponents).map((c) => c.name) as [string]),
      z.any(),
    )
    .nullish(),
});
const specSchema = Object.values(defaultComponents).reduce(
  (prev, { schema }) => z.intersection(prev, schema),
  z.intersection(baseSpecSchema, stylesSchema) as z.ZodType<any>,
);
const specSchemaWithVariants = z.intersection(
  specSchema,
  z.object({
    variants: z
      .record(z.string(), z.any().array()) // zodDeepPartial(specSchema).array()
      .nullish(),
  }),
);

const generatedSchema = zodToJsonSchema(specSchemaWithVariants, {
  $refStrategy: "none",
  removeAdditionalStrategy: "strict",
});

const schemaWithoutRequired = removeRequiredFields(generatedSchema);

await fs.promises.writeFile(
  "lib/schema.json",
  JSON.stringify(schemaWithoutRequired, null, 2),
  "utf-8",
);

// Reusable documentation builder function
async function buildDocsFromFiles(files: string[], docsDir: string) {
  for (const file of files) {
    const fileName = path.basename(file);
    const baseName = fileName.replace(/\.[^.]+$/, "");
    const code = await fs.promises.readFile(file, "utf-8");
    const lines = code.split(/\r?\n/);
    const headerStart = lines.findIndex((l) => l.startsWith("# > "));
    const headerLines = lines
      .slice(headerStart)
      .filter((l) => l.startsWith("#"));
    let title = "";
    const docs: string[] = [];
    for (const line of headerLines) {
      if (line.startsWith("# > ")) {
        title = line.replace(/^# > /, "");
      } else if (line.startsWith("# ")) {
        docs.push(line.replace(/^# /, ""));
      }
    }
    const docText = docs.join("\n");
    // PDF name logic: if output contains a .pdf path, use it
    const pdfMatch = code.match(/output:\s*([^\n]+)/);
    let pdfPath: string | null = null;
    if (pdfMatch) {
      const pdfRel = pdfMatch[1].trim().replace(/['"]/g, "");
      if (pdfRel.endsWith(".pdf")) {
        pdfPath = pdfRel.replace(/^\.\.\//, "");
      }
    }
    let md = "";
    if (title) md += `# ${title}\n\n`;
    if (docText) md += `${docText}\n\n`;
    md += `## Source\n\n<details><summary>Show code</summary>\n\n`;
    md += ["```yaml", code, "``\n", ""].join("\n");
    md += "</details>\n\n";
    if (pdfPath) {
      md += `[Show PDF](${pdfPath})\n`;
    }
    await fs.promises.writeFile(
      path.join(docsDir, `${baseName}.md`),
      md,
      "utf-8",
    );
  }
}

// Build docs for samples
const sampleFiles = [
  ...(await glob("samples/src/*.yml")),
  ...(await glob("samples/src/*.yaml")),
  ...(await glob("samples/src/*.md")),
];
await buildDocsFromFiles(sampleFiles, "docs/samples");

// Build docs for themes
const themeFiles = [
  ...(await glob("samples/src/themes/*.yml")),
  ...(await glob("samples/src/themes/*.yaml")),
  ...(await glob("samples/src/themes/*.md")),
];
await buildDocsFromFiles(themeFiles, "docs/themes");
