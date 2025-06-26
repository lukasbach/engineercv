import { glob } from "glob";
import { readFile } from "fs/promises";
import { generatePdf } from "./generate-pdf.js";

export const generate = async (pattern: string): Promise<void> => {
  const files = await glob(pattern.replaceAll("\\", "/"));

  if (files.length === 0) {
    throw new Error(`No files found matching pattern: ${pattern}`);
  }

  for (const file of files) {
    const yamlContent = await readFile(file, "utf-8");
    await generatePdf(yamlContent);
  }
};
