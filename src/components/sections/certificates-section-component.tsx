import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { workSectionComponent } from "./work-section-component.js";

export const certificatesSectionComponent = defineComponent({
  name: "certificates" as const,
  schema: z.object({
    strings: z
      .object({
        certificates: z.string().default(""),
      })
      .default({}),
    certificates: z
      .array(
        z.object({
          $id: z.string().optional(),
          name: z.string(),
          date: z.string().optional(),
          issuer: z.string().optional(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    if (!spec.certificates) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.certificates}
        </SectionHeader>
        {spec.certificates.map((section, index) => (
          <View key={index} style={styles.item}>
            <DetailsItem
              style={styles.details}
              title={
                section.url ? `[${section.name}](${section.url})` : section.name
              }
              right={section.date}
              details={section.issuer}
              separator=", "
            />
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
