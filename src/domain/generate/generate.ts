import { glob } from "glob";
import { readFile } from "fs/promises";
import * as yaml from "yaml";
import path from "path";
import { ZodError } from "zod";
import { Font, render } from "@react-pdf/renderer";
import fsExtra from "fs-extra/esm";
import { generatePdfDocument } from "./generate-pdf-document.js";
import { debug } from "../../cli/logging.js";
import { merge } from "./deepmerge.js";
import { resolveSpecsFromConfig } from "./resolve-specs-from-config.js";
import { globalConfig } from "./global-config.js";

const resolveConfigs = async (
  yamlPath: string,
): Promise<{ paths: string[]; config: any }> => {
  debug(`Resolving config for ${yamlPath}`);
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

const parseError = (error: unknown, file: string): Error[] => {
  if (error instanceof ZodError) {
    return error.errors.map((err) => ({
      file,
      message: `Validation error in ${file} (${err.code}): ${err.message} at path "${err.path.join(".")}"`,
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

  console.log(`Generated ${spec.output} from ${file}`);
};

export const generate = async (pattern: string) => {
  const files = await glob(pattern.replaceAll("\\", "/"));
  const trackedFiles = [];
  const errors: Error[] = [];

  if (files.length === 0) {
    throw new Error(`No files found matching pattern: ${pattern}`);
  }

  for (const file of files) {
    const { paths, config } = await resolveConfigs(file);
    trackedFiles.push(...paths);
    try {
      const variants = resolveSpecsFromConfig(config, file);
      for (const spec of variants.specs) {
        await processSpec(file, spec);
      }
    } catch (error) {
      errors.push(...parseError(error, file));
    }
  }

  debug("Tracked files:", trackedFiles);

  return { trackedFiles, files, errors };
};
