import { Link, Text } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";

export const urlComponent = defineComponent({
  name: "url",
  schema: z.object({}),
  additionalProps: z.object({
    url: z.string().url().nullish(),
    text: z.string().nullish(),
    style: z.any(),
  }),
  component: ({ url, text, styles, style }) => {
    if (!url) return <Text>{text ?? url}</Text>;
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    const [_, domain] = /^[^:]+:\/\/(?:www.)?([^?#]+)/.exec(url) || [];
    return (
      <Link src={url} style={[styles.container, style]}>
        {text ?? domain ?? url}
      </Link>
    );
  },
  defaultStyles: {
    container: {
      color: "black",
      textDecoration: "none",
    },
  },
});
