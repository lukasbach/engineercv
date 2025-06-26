import { glob } from "glob";
import { readFile } from "fs/promises";
import * as yaml from "yaml";
import path from "path";
import { merge } from "ts-deepmerge";
import { fileURLToPath } from "url";
import { generatePdf } from "./generate-pdf.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const generate = async (pattern: string): Promise<void> => {
  const files = await glob(pattern.replaceAll("\\", "/"));

  if (files.length === 0) {
    throw new Error(`No files found matching pattern: ${pattern}`);
  }

  for (const file of files) {
    const yamlConfig = yaml.parse(await readFile(file, "utf-8"));
    const globalsConfig = yaml.parse(
      await readFile(path.join(dirname, "../../globals.yml"), "utf-8"),
    );
    const config = merge(globalsConfig, yamlConfig);
    await generatePdf(config);
  }
};
