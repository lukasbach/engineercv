import { Text, View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { markdownComponent } from "./markdown-component.js";

export const listItemComponent = defineComponent({
  name: "listItem",
  schema: z.object({
    strings: z
      .object({
        bullet: z.string().default("\u2022"),
      })
      .default({}),
  }),
  additionalProps: z.object({ children: z.string(), style: z.any() }),
  component: ({ children, styles, style, spec, getComponent }) => {
    const Markdown = getComponent(markdownComponent);
    return (
      <View style={[styles.container, style]}>
        <View style={styles.bullet}>
          <Text>{spec.strings?.bullet}</Text>
        </View>
        <View style={styles.text}>
          <Markdown>{children}</Markdown>
        </View>
      </View>
    );
  },
  defaultStyles: {
    container: { display: "flex", flexDirection: "row" },
    bullet: { height: "100%", marginRight: "4pt" },
    text: { flex: 1, lineHeight: ".9" },
  } as const,
});
