import React from "react";
import z from "zod";
import { Text } from "@react-pdf/renderer";
import Handlebars from "handlebars";
import { defineComponent } from "../define-component.js";

export const pageNumbersComponent = defineComponent({
  name: "pageNumbers",
  schema: z.object({
    strings: z.object({
      pageTemplate: z.string().nullish(),
    }),
    config: z.object({
      usePageNumbers: z.boolean().nullish(),
    }),
  }),
  additionalProps: z.object({}),
  component: ({ spec, styles }) => {
    return (
      <Text
        fixed
        style={styles.container}
        render={({ pageNumber, totalPages }) => {
          if (spec.config.usePageNumbers === false) return null;
          if (spec.config.usePageNumbers !== true && totalPages <= 1)
            return null;
          const text = Handlebars.compile(spec.strings.pageTemplate || "")({
            totalPages,
            pageNumber,
          });
          return text;
        }}
      />
    );
  },
  defaultStyles: {
    container: {
      position: "absolute",
      bottom: "10pt",
      right: "10pt",
    },
  } as const,
});
