import { Image } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import * as fs from "node:fs";
import { defineComponent } from "../define-component.js";

export const imageComponent = defineComponent({
  name: "image",
  schema: z.object({}),
  additionalProps: z.object({
    src: z.string(),
    style: z.any(),
  }),
  component: ({ src, styles, style, resolvePath }) => {
    const resolvedSrc = resolvePath(src);
    return (
      <Image
        src={
          fs.existsSync(resolvedSrc)
            ? fs.readFileSync(resolvedSrc)
            : resolvedSrc
        }
        style={[styles.container, style]}
      />
    );
  },
  defaultStyles: {
    container: {},
  },
});
