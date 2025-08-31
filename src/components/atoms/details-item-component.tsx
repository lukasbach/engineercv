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
    title: z.string().nullish(),
    details: z.any().nullish(),
    right: z.any().nullish(),
    separator: z.string().nullish(),
    summary: z.string().nullish(),
    list: z.string().array().nullish(),
    detailsInExtraLine: z.boolean().nullish(),
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
    detailsInExtraLine,
  }) => {
    const Markdown = getComponent(markdownComponent);
    const ListItem = getComponent(listItemComponent);
    return (
      <View wrap={false}>
        <View style={[styles.container, style]}>
          <View style={styles.leftContent}>
            {joinComponents(
              [
                title && <Markdown style={styles.title}>{title}</Markdown>,
                details && !detailsInExtraLine && (
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
        {detailsInExtraLine && details && (
          <View style={styles.extraLineDetails}>{details}</View>
        )}
        <View style={styles.list}>
          {list?.map((item, itemIndex) => (
            <ListItem key={itemIndex} style={styles.listItem}>
              {item}
            </ListItem>
          ))}
        </View>
        <Markdown style={styles.summary} children={summary ?? ""} />
      </View>
    );
  },
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "row",
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
    summary: {
      marginTop: "4pt",
    },
    list: {
      marginTop: "4pt",
    },
    listItem: {},
    extraLineDetails: {
      fontStyle: "italic",
      display: "flex",
      flexDirection: "row",
      marginTop: "4pt",
    },
  } as const,
});
