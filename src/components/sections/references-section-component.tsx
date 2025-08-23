import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const referencesSectionSchema = z.object({
  strings: z
    .object({
      references: z.string().default(""),
    })
    .default({}),
  references: z
    .array(
      z.object({
        $id: z.string().nullish(),
        name: z.string(),
        reference: z.string().nullish(),
      }),
    )
    .nullish(),
});

export const referencesSectionComponent = defineComponent({
  name: "references" as const,
  schema: referencesSectionSchema,
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsList = getComponent(detailsListComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    if (!spec.references) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.references}
        </SectionHeader>
        <DetailsList>
          {spec.references.map((section, index) => (
            <View key={index} style={styles.item}>
              <DetailsItem
                style={styles.item}
                title={section.name}
                summary={section.reference}
              />
            </View>
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
