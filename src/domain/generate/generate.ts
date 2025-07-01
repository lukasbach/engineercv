import { glob } from "glob";
import { readFile } from "fs/promises";
import * as yaml from "yaml";
import path from "path";
import { ZodError, z } from "zod";
import { Font, View, render } from "@react-pdf/renderer";
import fsExtra from "fs-extra/esm";
import esbuild from "esbuild";
import os from "os";
import React from "react";
import { generatePdfDocument } from "./generate-pdf-document.js";
import { debug } from "../../cli/logging.js";
import { merge } from "./deepmerge.js";
import { resolveSpecsFromConfig } from "./resolve-specs-from-config.js";
import { globalConfig } from "./global-config.js";
import { defineComponent } from "../../components/define-component.js";

const readConfigFile = async (filePath: string): Promise<any> => {
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath, extension);

  if (extension === ".yml" || extension === ".yaml") {
    return yaml.parse(await readFile(filePath, "utf-8"));
  }

  if (extension === ".json") {
    return JSON.parse(await readFile(filePath, "utf-8"));
  }

  if ([".js", ".mjs", ".jsx", ".ts", ".tsx"].includes(extension)) {
    const tempFile = path.join(os.tmpdir(), `engineercv-${baseName}.js`);
    const context = await esbuild.context({
      entryPoints: [filePath],
      bundle: true,
      external: [],
      format: "cjs",
      target: "es2018",
      outfile: tempFile,
      loader: {},
    });
    await context.rebuild();
    // TODO handle in seperate file
    (global as any).React = React;
    (global as any).z = z;
    (global as any).View = View;
    (global as any).defineComponent = defineComponent;
    const moduleContent = await import(`file://${tempFile}`);
    return moduleContent.default || moduleContent;
  }

  throw new Error(`Unsupported file type: ${extension}`);
};

const resolveConfig = async (
  filePath: string,
): Promise<{ paths: string[]; config: any }> => {
  debug(`Resolving config for ${filePath}`);
  const config = await readConfigFile(filePath);

  const importedPaths: string[] = (config.imports || []).map(
    (importPath: string) =>
      path.isAbsolute(importPath)
        ? importPath
        : path.join(path.dirname(filePath), importPath),
  );
  const result = (
    await Promise.all(
      importedPaths.map((importPath) => resolveConfig(importPath)),
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
    const { paths, config } = await resolveConfig(file);
    trackedFiles.push(...paths);
    try {
      const specs = resolveSpecsFromConfig(config, file);
      for (const spec of specs) {
        await processSpec(file, spec);
      }
    } catch (error) {
      errors.push(...parseError(error, file));
    }
  }

  debug("Tracked files:", trackedFiles);

  return { trackedFiles, files, errors };
};
