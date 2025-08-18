import React from "react";
import { z } from "zod";
import { View } from "@react-pdf/renderer";
import { defineComponent } from "../define-component.js";
import { markdownComponent } from "../atoms/markdown-component.js";
import { basicsItemsComponent } from "../atoms/basics-items-component.js";
import { textWithIconComponent } from "../atoms/text-with-icon.js";

export const iconConfig = z.object({
  suite: z.string().nullish(),
  icon: z.string(),
});

export const basicsSectionComponent = defineComponent({
  name: "basics" as const,
  schema: z.object({
    basics: z.object({
      name: z.string(),
      label: z.string().nullish(),
      image: z.string().nullish(),
      email: z.string().nullish(),
      phone: z.string().nullish(),
      url: z.string().nullish(),
      summary: z.string().nullish(),
      location: z
        .object({
          address: z.string().nullish(),
          postalCode: z.string().or(z.number()).nullish(),
          city: z.string().nullish(),
          countryCode: z.string().nullish(),
          region: z.string().nullish(),
        })
        .nullish(),
      locationFormat: z.string().nullish(),
      profiles: z
        .array(
          z.object({
            network: z.string(),
            username: z.string(),
            url: z.string().url(),
          }),
        )
        .nullish(),
      highlights: z.string().array().nullish(),
      order: z.string().array().nullish(),
      icons: z.record(z.string(), iconConfig).nullish(),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const TextWithIcon = getComponent(textWithIconComponent);
    const Markdown = getComponent(markdownComponent);
    const BasicsItems = getComponent({
      name: "basicsItems",
    } as typeof basicsItemsComponent);

    return (
      <View style={styles.container}>
        <Markdown style={styles.name}>{spec.basics.name}</Markdown>
        <View style={styles.itemContainer}>
          <BasicsItems
            renderItem={(item, icon, key) => (
              <TextWithIcon suite={icon?.suite} icon={icon?.icon} key={key}>
                <Markdown style={styles.item}>{item}</Markdown>
              </TextWithIcon>
            )}
          />
        </View>
        {spec.basics.summary && (
          <Markdown style={styles.summary}>{spec.basics.summary}</Markdown>
        )}
      </View>
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
      alignItems: "center",
      width: "90%",
      marginLeft: "5%",
      columnGap: "24pt",
      rowGap: "4pt",
    },
    item: {
      color: "black",
      textAlign: "center",
      minWidth: "0",
      fontStyle: "italic",
    },
    summary: {
      marginTop: "12pt",
      marginBottom: "4pt",
    },
  } as const,
});
