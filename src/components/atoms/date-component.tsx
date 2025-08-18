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
        dateFormat: z.string().nullish(),
      })
      .default({}),
  }),
  additionalProps: z.object({
    date: z.string().nullish(),
    format: z.string().nullish(),
    style: z.any(),
  }),
  component: ({ spec, date, format, styles, style }) => {
    const formattedDate = moment(new Date(date ?? "")).format(
      format ?? spec.config?.dateFormat ?? "YYYY/MM",
    );
    return <Text style={[styles.container, style]}>{formattedDate}</Text>;
  },
  defaultStyles: {
    container: {},
  },
});
