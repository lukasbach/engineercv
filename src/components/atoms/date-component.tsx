import { Text } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import moment from "moment";
import { defineComponent } from "../define-component.js";

export const dateComponent = defineComponent({
  name: "date",
  schema: z.object({
    config: z
      .object({
        dateFormat: z.string().optional(),
      })
      .default({}),
  }),
  additionalProps: z.object({
    date: z.string().optional(),
    format: z.string().optional(),
    style: z.any(),
  }),
  component: ({ spec, date, format, styles, style }) => {
    const formattedDate = moment(date ?? new Date()).format(
      format ?? spec.config?.dateFormat ?? "YYYY/MM",
    );
    return <Text style={[styles.container, style]}>{formattedDate}</Text>;
  },
  defaultStyles: {
    container: {},
  },
});
