import { glob } from "glob";
import { readFile } from "fs/promises";
import { existsSync } from "node:fs";
import * as yaml from "yaml";
import path from "node:path";
import { ZodError } from "zod";
import { Font, render } from "@react-pdf/renderer";
import fsExtra from "fs-extra/esm";
import grayMatter from "gray-matter";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { generatePdfDocument } from "./generate-pdf-document.js";
import { logger, logger } from "../cli/logging.js";
import { merge } from "./deepmerge.js";
import { resolveSpecsFromConfig } from "./resolve-specs-from-config.js";
import { globalConfig } from "./global-config.js";
import { importJsSpec } from "./import-js-spec.js";
import { advancedDeepmerge } from "./advanced-deepmerge.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const nodeModulesPath = path.join(dirname, "..", "..", "..");

const validExtensions = [
  ".yml",
  ".yaml",
  ".json",
  ".md",
  ".js",
  ".mjs",
  ".jsx",
  ".ts",
  ".tsx",
];

const isValidExtension = (file: string): boolean =>
  validExtensions.includes(path.extname(file));

const existsWithValidExtension = async (
  file: string,
): Promise<string | null | undefined> =>
  (
    await Promise.all(
      validExtensions.map(async (ext) => {
        if (await fsExtra.pathExists(file + ext)) {
          return file + ext;
        }
        return null;
      }),
    )
  ).find(Boolean);

const resolveFileName = async (
  filePath: string,
  relativeImportPath: string,
): Promise<string> => {
  if (filePath.startsWith(".")) {
    const absolute = path.resolve(
      path.join(path.dirname(relativeImportPath), filePath),
    );
    logger.debug(`Resolving relative file from ${filePath} to ${absolute}`);
    return resolveFileName(absolute, relativeImportPath);
  }

  const extension = path.extname(filePath);

  if (!extension) {
    logger.debug(
      `No extension in imported file ${filePath}, attempting to resolve library themes.`,
    );
    const libraryPaths = [
      path.join(nodeModulesPath, "engineercv/src/themes", filePath),
      path.join(nodeModulesPath, filePath),
      path.join(nodeModulesPath, filePath, "theme"),
    ];
    for (const libraryPath of libraryPaths) {
      logger.debug(`Checking for theme file: ${libraryPath}`);
      const foundFile = await existsWithValidExtension(libraryPath);
      if (foundFile) {
        logger.debug(`Resolved theme ${filePath} from library: ${foundFile}`);
        return resolveFileName(foundFile, relativeImportPath);
      }
    }
  }

  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return filePath;
};

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

const isDefiningOutput = (config: any): boolean => {
  const output =
    config.output ||
    Object.values(config.variants || {}).find((v: any) => !!v.output);
  return !!output && output !== "skip" && output !== "none";
};

export const resolveConfigImports = async (
  config: any,
  configFilePath: string,
  resolvingImport = false,
): Promise<{ paths: string[]; config: any | null }> => {
  if (!resolvingImport && config.isTemplate) {
    logger.debug(
      `Skipping template file ${configFilePath} because "isTemplate" is set.`,
    );
    return { paths: [], config: null };
  }

  const basePaths: string[] = await Promise.all(
    (config.base || []).map((importPath: string) =>
      resolveFileName(importPath, configFilePath),
    ),
  );
  const importedPaths: string[] = await Promise.all(
    (config.imports || []).map((importPath: string) =>
      resolveFileName(importPath, configFilePath),
    ),
  );
  const baseItems = await Promise.all(
    basePaths.map(async (basePath) =>
      resolveConfigImports(await readConfigFile(basePath), basePath, true),
    ),
  );
  const importedItems = await Promise.all(
    importedPaths.map(async (importPath) =>
      resolveConfigImports(await readConfigFile(importPath), importPath, true),
    ),
  );
  const result = [
    ...baseItems,
    { paths: [configFilePath], config },
    ...importedItems,
  ].reduce(
    (acc, { paths, config }) => {
      acc.paths.push(...paths);
      acc.config = advancedDeepmerge(acc.config, config);
      return acc;
    },
    // { paths: [configFilePath], config },
    { paths: [], config: {} },
  );

  if (!resolvingImport && !isDefiningOutput(result.config)) {
    logger.debug(
      `No output defined in config for ${configFilePath}, ignoring file.`,
    );
    return { paths: [], config: null };
  }

  result.config.imports = [];
  result.config.isTemplate = false;

  return result;
};

const resolveConfig = async (
  // TODO
  filePath: string,
  resolvingImport = false,
): Promise<{ paths: string[]; config: any | null }> => {
  const config = await readConfigFile(filePath);
  return resolveConfigImports(config, filePath, resolvingImport);
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
    try {
      const { paths, config } = await resolveConfig(file);
      trackedFiles.push(...paths);
      // eslint-disable-next-line no-continue
      if (!config) continue;

      const specs = await resolveSpecsFromConfig(config, file);
      (() => {
        if (!process.argv.includes("--verbose") && !process.argv.includes("-v"))
          return;
        // eslint-disable-next-line no-shadow, unused-imports/no-unused-vars
        for (const spec of specs) {
          const { config, ...logSpec } = spec;
          console.log(
            `Resolved specification for ${file}: ${chalk.dim(JSON.stringify(logSpec, null, 2))}`,
          );
        }
      })();
      for (const spec of specs) {
        if (spec.config?.skip) {
          logger.debug(`Skipping file ${file} due to skip flag.`);
        } else if (spec.config) {
          trackedFiles.push(...spec.paths);
          await processSpec(file, spec.config);
        }
      }
    } catch (error) {
      errors.push(...parseError(error, file));
    }
  }

  const uniqueTrackedFiles = Array.from(new Set(trackedFiles));

  logger.debug("Tracked files:", uniqueTrackedFiles);

  return { trackedFiles: uniqueTrackedFiles, files, errors };
};
