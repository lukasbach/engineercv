import { glob } from "glob";
import { readFile } from "fs/promises";
import * as yaml from "yaml";
import path from "path";
import { ZodError } from "zod";
import { Font, render } from "@react-pdf/renderer";
import fsExtra from "fs-extra/esm";
import grayMatter from "gray-matter";
import { generatePdfDocument } from "./generate-pdf-document.js";
import { logger } from "../../cli/logging.js";
import { merge } from "./deepmerge.js";
import { resolveSpecsFromConfig } from "./resolve-specs-from-config.js";
import { globalConfig } from "./global-config.js";
import { importJsSpec } from "./import-js-spec.js";

const isValidExtension = (file: string): boolean =>
  [
    ".yml",
    ".yaml",
    ".json",
    ".md",
    ".js",
    ".mjs",
    ".jsx",
    ".ts",
    ".tsx",
  ].includes(path.extname(file));

const readConfigFile = async (filePath: string): Promise<any> => {
  const extension = path.extname(filePath);

  if (extension === ".yml" || extension === ".yaml") {
    return yaml.parse(await readFile(filePath, "utf-8"));
  }

  if (extension === ".json") {
    return JSON.parse(await readFile(filePath, "utf-8"));
  }

  if (extension === ".md") {
    const { data, content } = grayMatter(await readFile(filePath, "utf-8"));
    return { ...data, content };
  }

  if ([".js", ".mjs", ".jsx", ".ts", ".tsx"].includes(extension)) {
    return importJsSpec(filePath);
  }

  throw new Error(`Unsupported file type: ${extension}`);
};

const isDefiningOutput = (config: any): boolean =>
  config.output ||
  Object.values(config.variants || {}).some((v: any) => !!v.output);

const resolveConfig = async (
  filePath: string,
  resolvingImport = false,
): Promise<{ paths: string[]; config: any | null }> => {
  logger.debug(`Resolving config for ${filePath}`);
  const config = await readConfigFile(filePath);

  if (!resolvingImport && config.isTemplate) {
    logger.debug(
      `Skipping template file ${filePath} because "isTemplate" is set.`,
    );
    return { paths: [], config: null };
  }

  const importedPaths: string[] = (config.imports || []).map(
    (importPath: string) =>
      path.isAbsolute(importPath)
        ? importPath
        : path.join(path.dirname(filePath), importPath),
  );
  const result = (
    await Promise.all(
      importedPaths.map((importPath) => resolveConfig(importPath, true)),
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
    { paths: [filePath], config },
  );

  if (!resolvingImport && !isDefiningOutput(result.config)) {
    logger.debug(`No output defined in config for ${filePath}, ignoring file.`);
    return { paths: [], config: null };
  }

  return result;
};

type Error = {
  file: string;
  message: string;
};

const parseError = (error: unknown, file: string): Error[] => {
  if (error instanceof ZodError) {
    return error.errors.map((err) => ({
      file,
      message: `Validation error !!${err.code}!!: ${err.message} at path [$.${err.path.join(".")}]`,
    }));
  }
  return [
    {
      file,
      message:
        error instanceof Error
          ? `${error.message} (Stack: ${error.stack})`
          : String(error),
    },
  ];
};

const processSpec = async (file: string, spec: any) => {
  const { document, fonts } = await generatePdfDocument(
    merge(globalConfig, spec),
    file,
  );

  const target = path.join(path.dirname(file), spec.output);
  await fsExtra.ensureDir(path.dirname(target));

  fonts.forEach((font) => {
    Font.register({
      ...(font as any),
      src: path.isAbsolute(font.src)
        ? font.src
        : path.resolve(path.join(path.dirname(file), font.src)),
    });
  });

  await render(document, target);

  logger.success(`Generated {${spec.output}} from {${file}}`);
};

export const generate = async (pattern: string) => {
  const files = (await glob(pattern.replaceAll("\\", "/"))).filter(
    isValidExtension,
  );
  const trackedFiles = [];
  const errors: Error[] = [];

  if (files.length === 0) {
    throw new Error(`No files found matching pattern: ${pattern}`);
  }

  for (const file of files) {
    const { paths, config } = await resolveConfig(file);
    trackedFiles.push(...paths);
    // eslint-disable-next-line no-continue
    if (!config) continue;

    try {
      const specs = resolveSpecsFromConfig(config, file);
      for (const spec of specs) {
        if (spec.skip) {
          logger.debug(`Skipping file ${file} due to skip flag.`);
        } else {
          await processSpec(file, spec);
        }
      }
    } catch (error) {
      errors.push(...parseError(error, file));
    }
  }

  logger.debug("Tracked files:", trackedFiles);

  return { trackedFiles, files, errors };
};
