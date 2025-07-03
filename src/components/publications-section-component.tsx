import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { detailsItemComponent } from "./details-item-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { joinComponents } from "./utils.js";
import { markdownComponent } from "./markdown-component.js";

export const publicationsSectionComponent = defineComponent({
  name: "publications" as const,
  schema: z.object({
    strings: z
      .object({
        publications: z.string().default(""),
      })
      .default({}),
    publications: z
      .array(
        z.object({
          $id: z.string().optional(),
          name: z.string(),
          publisher: z.string().optional(),
          releaseDate: z.string().optional(),
          url: z.string().url().optional(),
          summary: z.string().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const Markdown = getComponent(markdownComponent);
    if (!spec.publications) return null;
    return (
      <View wrap={false}>
        <SectionHeader style={styles.header}>
          {spec.strings?.publications}
        </SectionHeader>
        {spec.publications.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={
                section.url ? `[${section.name}](${section.url})` : section.name
              }
              right={section.releaseDate}
              details={joinComponents([section.publisher])}
              separator=", "
              bottomMargin={!!section.summary}
            />
            <Markdown style={styles.summary} children={section.summary ?? ""} />
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: {
    container: {},
    header: {},
    section: {
      marginBottom: "8pt",
    },
    details: {},
    summary: {},
  } as const,
});
