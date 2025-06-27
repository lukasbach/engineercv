import { glob } from "glob";
import { readFile } from "fs/promises";
import * as yaml from "yaml";
import path from "path";
import { fileURLToPath } from "url";
import { ZodError } from "zod";
import { generatePdf } from "./generate-pdf.js";
import { debug } from "../../cli/logging.js";
import { merge } from "./deepmerge.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const resolveConfigs = async (
  yamlPath: string,
): Promise<{ paths: string[]; config: any }> => {
  const yamlConfig = yaml.parse(await readFile(yamlPath, "utf-8"));
  const importedPaths: string[] = (yamlConfig.imports || []).map(
    (importPath: string) =>
      path.isAbsolute(importPath)
        ? importPath
        : path.join(path.dirname(yamlPath), importPath),
  );
  const result = (
    await Promise.all(
      importedPaths.map((importPath) => resolveConfigs(importPath)),
    )
  ).reduce(
    (acc, { paths, config }) => {
      acc.paths.push(...paths);
      acc.config = merge.withOptions(
        {
          allowUndefinedOverrides: false,
          mergeArrays: false,
        },
        config,
        acc.config,
      );
      return acc;
    },
    { paths: [yamlPath], config: yamlConfig },
  );

  // console.debug(`Resolved config for ${yamlPath}:`, result.config);
  return result;
};

type Error = {
  file: string;
  message: string;
};

export const generate = async (pattern: string) => {
  const files = await glob(pattern.replaceAll("\\", "/"));
  const trackedFiles = [];
  const errors: Error[] = [];

  if (files.length === 0) {
    throw new Error(`No files found matching pattern: ${pattern}`);
  }

  const globalsConfig = yaml.parse(
    await readFile(path.join(dirname, "../../globals.yml"), "utf-8"),
  );

  for (const file of files) {
    const { paths, config } = await resolveConfigs(file);
    trackedFiles.push(...paths);
    try {
      await generatePdf(merge(globalsConfig, config));
    } catch (error) {
      if (error instanceof ZodError) {
        errors.push(
          ...error.errors.map((err) => ({
            file,
            message: `Validation error in ${file} (${err.code}): ${err.message} at path "${err.path.join(".")}"`,
          })),
        );
      } else {
        errors.push({
          file,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  debug("Tracked files:", trackedFiles);

  return { trackedFiles, files, errors };
};
