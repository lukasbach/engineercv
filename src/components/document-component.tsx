import React from "react";
import z from "zod";
import { Document } from "@react-pdf/renderer";
import { defineComponent } from "./define-component.js";

export const documentComponent = defineComponent({
  name: "document",
  schema: z.object({
    info: z.object({
      name: z.string(),
      author: z.string().optional(),
      subject: z.string().optional(),
      language: z.string().optional(),
    }),
  }),
  additionalProps: z.object({ children: z.any() }),
  component: ({ children, styles, spec }) => (
    <Document
      style={styles.container}
      title={spec.info.name}
      author={spec.info.author}
      creator={spec.info.author ?? "engineercv"}
      producer={spec.info.author ?? "engineercv"}
      language={spec.info.language ?? "en-US"}
    >
      {children}
    </Document>
  ),
  defaultStyles: { container: {} },
});
