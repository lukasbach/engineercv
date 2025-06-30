import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { markdownComponent } from "./markdown-component.js";

export const titleSectionComponent = defineComponent({
  name: "title",
  schema: z.object({
    info: z.object({ name: z.string() }),
    title: z
      .object({
        items: z.string().array().optional(),
        summary: z.string().optional(),
      })
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent(markdownComponent);
    return (
      spec.title && (
        <View style={styles.container}>
          <Markdown style={styles.name}>{spec.info.name}</Markdown>
          <View style={styles.itemContainer}>
            {spec.title.items?.map((item, index) => (
              <Markdown
                key={index}
                style={[styles.item, index === 0 ? styles.firstItem : {}]}
              >
                {item}
              </Markdown>
            ))}
          </View>
          {spec.title.summary && (
            <Markdown style={styles.summary}>{spec.title.summary}</Markdown>
          )}
        </View>
      )
    );
  },
  defaultStyles: {
    container: {},
    name: {
      fontSize: "24pt",
      textAlign: "center",
      marginBottom: "8pt",
      marginTop: "8pt",
    },
    itemContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    item: {
      borderLeft: "1pt solid black",
      paddingLeft: "5pt",
      marginLeft: "5pt",
      color: "black",
    },
    firstItem: {
      borderLeft: "none",
      paddingLeft: 0,
      marginLeft: 0,
    },
    summary: {
      marginTop: "8pt",
      marginBottom: "8pt",
    },
  } as const,
});
