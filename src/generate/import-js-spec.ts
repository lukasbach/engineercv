import * as ReactPdf from "@react-pdf/renderer";
import path from "path";
import React from "react";
import z from "zod";
import esbuild from "esbuild";
import os from "os";
import { defineComponent } from "../components/define-component.js";
import { defaultComponents } from "../components/default-components.js";

export const importJsSpec = async (filePath: string) => {
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath, extension);

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

  (global as any).React = React;
  (global as any).z = z;
  (global as any).ReactPdf = ReactPdf;
  (global as any).defineComponent = defineComponent;
  (global as any).defaultComponents = defaultComponents;

  const moduleContent = await import(`file://${tempFile}`);
  return moduleContent.default || moduleContent;
};
