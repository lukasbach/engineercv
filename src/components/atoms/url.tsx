import { Link } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";

export const urlComponent = defineComponent({
  name: "url",
  schema: z.object({}),
  additionalProps: z.object({
    url: z.string().url().optional(),
    style: z.any(),
  }),
  component: ({ url, styles, style }) => {
    if (!url) return null;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const [_, domain] = /^[^:]+:\/\/(?:www.)?([^?#]+)/.exec(url) || [];
    return (
      <Link src={url} style={[styles.container, style]}>
        {domain ?? url}
      </Link>
    );
  },
  defaultStyles: {
    container: {},
  },
});
