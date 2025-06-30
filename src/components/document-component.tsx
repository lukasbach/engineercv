import React from "react";
import z from "zod";
import { Document } from "@react-pdf/renderer";
import { defineComponent } from "./define-component.js";

export const documentComponent = defineComponent({
  name: "document",
  schema: z.object({}),
  additionalProps: z.object({ children: z.any() }),
  component: ({ children, styles }) => (
    <Document style={styles.container}>{children}</Document>
  ),
  defaultStyles: { container: {} },
});
