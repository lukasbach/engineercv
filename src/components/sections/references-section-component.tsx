import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { workSectionComponent } from "./work-section-component.js";

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
    if (!spec.references) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.references}
        </SectionHeader>
        {spec.references.map((section, index) => (
          <View key={index} style={styles.item}>
            <DetailsItem
              style={styles.details}
              title={section.name}
              summary={section.reference}
            />
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
