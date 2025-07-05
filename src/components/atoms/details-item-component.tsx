import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { markdownComponent } from "./markdown-component.js";
import { joinComponents } from "../utils.js";

export const detailsItemComponent = defineComponent({
  name: "detailsItem",
  schema: z.object({}),
  additionalProps: z.object({
    style: z.any(),
    title: z.string().optional(),
    details: z.any().optional(),
    right: z.any().optional(),
    separator: z.string().optional(),
    bottomMargin: z.boolean().optional(),
  }),
  component: ({
    title,
    details,
    right,
    separator,
    styles,
    style,
    getComponent,
    bottomMargin,
  }) => {
    const Markdown = getComponent(markdownComponent);
    return (
      <View
        style={[styles.container, style, bottomMargin && styles.bottomMargin]}
      >
        <View style={styles.leftContent}>
          {joinComponents(
            [
              <Markdown style={styles.title}>{title}</Markdown>,
              <Markdown style={styles.details}>{details}</Markdown>,
            ],
            separator,
          )}
        </View>
        {right && (
          <View style={styles.rightContent}>
            {typeof right === "string" ? <Markdown>{right}</Markdown> : right}
          </View>
        )}
      </View>
    );
  },
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "row",
    },
    bottomMargin: {
      marginBottom: "6pt",
    },
    title: {
      fontWeight: "bold",
    },
    details: {
      display: "flex",
      flexDirection: "row",
    },
    leftContent: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
    },
    rightContent: {},
  } as const,
});
