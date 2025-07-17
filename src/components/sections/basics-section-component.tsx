import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import Handlebars from "handlebars";
import { defineComponent } from "../define-component.js";
import { markdownComponent } from "../atoms/markdown-component.js";
import { urlComponent } from "../atoms/url.js";

export const basicsSectionComponent = defineComponent({
  name: "basics" as const,
  schema: z.object({
    basics: z.object({
      name: z.string(),
      label: z.string().optional(),
      image: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      url: z.string().optional(),
      summary: z.string().optional(),
      location: z
        .object({
          address: z.string().optional(),
          postalCode: z.string().optional(),
          city: z.string().optional(),
          countryCode: z.string().optional(),
          region: z.string().optional(),
        })
        .optional(),
      locationFormat: z.string().optional(),
      profiles: z
        .array(
          z.object({
            network: z.string(),
            username: z.string(),
            url: z.string().url(),
          }),
        )
        .optional(),
      highlights: z.string().array().optional(),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent(markdownComponent);
    const Url = getComponent(urlComponent);
    const location = spec.basics.location
      ? Handlebars.create().compile(spec.basics.locationFormat ?? "{{city}}")(
          spec.basics.location,
        )
      : null;
    return (
      <View style={styles.container}>
        <Markdown style={styles.name}>{spec.basics.name}</Markdown>
        <View style={styles.itemContainer}>
          {[
            spec.basics.email &&
              `[${spec.basics.email}](mailto:${spec.basics.email})`,
            spec.basics.phone &&
              `[${spec.basics.phone}](tel:${spec.basics.phone.replaceAll(/[^\d]/g, "")})`,
            spec.basics.url && <Url url={spec.basics.url} />,
            ...(spec.basics.profiles?.map((profile) => (
              <Url key={profile.network} url={profile.url} />
            )) ?? []),
            location,
            ...(spec.basics.highlights ?? []),
          ]
            .filter(Boolean)
            .map((item, index) => {
              return (
                <View style={styles.item} key={index}>
                  <Markdown>{item}</Markdown>
                </View>
              );
            })}
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
