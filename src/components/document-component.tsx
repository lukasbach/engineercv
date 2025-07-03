import React from "react";
import z from "zod";
import { Document } from "@react-pdf/renderer";
import { defineComponent } from "./define-component.js";

export const documentComponent = defineComponent({
  name: "document",
  schema: z.object({
    basics: z.object({
      name: z.string(),
      author: z.string().optional(),
      language: z.string().optional(),
    }),
  }),
  additionalProps: z.object({ children: z.any() }),
  component: ({ children, styles, spec }) => (
    <Document
      style={styles.container}
      title={spec.basics.name}
      author={spec.basics.author ?? spec.basics.name}
      creator={spec.basics.author ?? spec.basics.name ?? "engineercv"}
      producer={spec.basics.author ?? "engineercv"}
      language={spec.basics.language ?? "en-US"}
    >
      {children}
    </Document>
  ),
  defaultStyles: { container: {} },
});
