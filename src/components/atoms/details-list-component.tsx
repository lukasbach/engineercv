import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";

export const detailsListComponent = defineComponent({
  name: "detailsList",
  schema: z.object({}),
  additionalProps: z.object({
    children: z.any(),
  }),
  component: ({ children, styles }) => (
    <View style={styles.container}>{children}</View>
  ),
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "12pt",
    },
  } as const,
});
