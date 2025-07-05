import { Text } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";

export const sectionHeaderComponent = defineComponent({
  name: "sectionHeader",
  schema: z.object({}),
  additionalProps: z.object({ children: z.any(), style: z.any() }),
  component: ({ children, styles, style }) => (
    <Text style={[styles.container, style]}>{children}</Text>
  ),
  defaultStyles: {
    container: {
      borderBottom: "1pt solid black",
      marginTop: "8pt",
      marginBottom: "6pt",
      paddingBottom: "2pt",
      fontSize: "14pt",
    },
  },
});
