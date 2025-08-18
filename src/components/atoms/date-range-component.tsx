import { Text } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { dateComponent } from "./date-component.js";

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
    start: z.string().nullish(),
    end: z.string().nullish(),
    format: z.string().nullish(),
    style: z.any(),
  }),
  component: ({ start, end, format, styles, style, getComponent, spec }) => {
    const DateComponent = getComponent(dateComponent);
    return (
      <Text style={[styles.container, style]}>
        {start && <DateComponent date={start} format={format} />}
        {start && ` – `}
        {end ? (
          <DateComponent date={end} format={format} />
        ) : (
          spec.strings?.untilNow
        )}
      </Text>
    );
  },
  defaultStyles: {
    container: {},
  },
});
