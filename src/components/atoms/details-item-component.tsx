import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { markdownComponent } from "./markdown-component.js";
import { joinComponents } from "../utils.js";
import { listItemComponent } from "./list-item-component.js";

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
    summary: z.string().optional(),
    list: z.string().array().optional(),
  }),
  component: ({
    title,
    details,
    right,
    separator,
    summary,
    list,
    styles,
    style,
    getComponent,
    bottomMargin,
  }) => {
    const Markdown = getComponent(markdownComponent);
    const ListItem = getComponent(listItemComponent);
    return (
      <View>
        <View
          style={[styles.container, style, bottomMargin && styles.bottomMargin]}
        >
          <View style={styles.leftContent}>
            {joinComponents(
              [
                title && <Markdown style={styles.title}>{title}</Markdown>,
                details && (
                  <Markdown style={styles.details}>{details}</Markdown>
                ),
              ],
              separator ?? ", ",
            )}
          </View>
          {right && (
            <View style={styles.rightContent}>
              {typeof right === "string" ? <Markdown>{right}</Markdown> : right}
            </View>
          )}
        </View>
        {list?.map((item, itemIndex) => (
          <ListItem key={itemIndex} style={styles.listItem}>
            {item}
          </ListItem>
        ))}
        <Markdown style={styles.summary} children={summary ?? ""} />
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
    summary: {},
    listItem: {},
  } as const,
});
