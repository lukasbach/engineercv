import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { detailsItemComponent } from "./details-item-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { markdownComponent } from "./markdown-component.js";

export const referencesSectionComponent = defineComponent({
  name: "references" as const,
  schema: z.object({
    strings: z
      .object({
        references: z.string().default(""),
      })
      .default({}),
    references: z
      .array(
        z.object({
          $id: z.string().optional(),
          name: z.string(),
          reference: z.string().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const Markdown = getComponent(markdownComponent);
    if (!spec.references) return null;
    return (
      <View wrap={false}>
        <SectionHeader style={styles.header}>
          {spec.strings?.references}
        </SectionHeader>
        {spec.references.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.name}
              bottomMargin={!!section.reference}
            />
            <Markdown
              style={styles.summary}
              children={section.reference ?? ""}
            />
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
