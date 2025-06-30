import { Page } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";

export const pageComponent = defineComponent({
  name: "page",
  schema: z.object({
    config: z
      .object({
        size: z.string().default("Letter"),
      })
      .default({}),
  }),
  additionalProps: z.object({ children: z.any(), test: z.string() }),
  component: ({ children, styles, spec }) => (
    <Page size={spec.config?.size as any} style={styles.container}>
      {children}
    </Page>
  ),
  defaultStyles: {
    container: {
      paddingHorizontal: 20,
      paddingVertical: 35,
      fontSize: 12,
    },
  },
});
