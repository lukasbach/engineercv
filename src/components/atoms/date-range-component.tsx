import { Text } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";

export const dateRangeComponent = defineComponent({
  name: "dateRange",
  schema: z.object({
    strings: z
      .object({
        untilNow: z.string().default(""),
      })
      .default({}),
  }),
  additionalProps: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
    style: z.any(),
  }),
  component: ({ spec, start, end, styles, style }) => (
    <Text style={[styles.container, style]}>
      {start && `${start} – `}
      {end ?? spec.strings?.untilNow}
    </Text>
  ),
  defaultStyles: {
    container: {},
  },
});
