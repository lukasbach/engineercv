import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const awardsSectionSchema = z.object({
  config: z
    .object({
      wrap: z.object({ awards: z.boolean().nullish() }).nullish(),
    })
    .nullish(),
  strings: z
    .object({
      awards: z.string().default(""),
    })
    .default({}),
  awards: z
    .array(
      z.object({
        $id: z.string().nullish(),
        title: z.string(),
        date: z.string().nullish(),
        awarder: z.string().nullish(),
        summary: z.string().nullish(),
      }),
    )
    .nullish(),
});

export const awardsSectionComponent = defineComponent({
  name: "awards" as const,
  schema: awardsSectionSchema,
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DetailsList = getComponent(detailsListComponent);
    if (!spec.awards) return null;
    return (
      <View style={styles.container} wrap={spec.config?.wrap?.awards ?? true}>
        <SectionHeader style={styles.header}>
          {spec.strings?.awards}
        </SectionHeader>
        <DetailsList>
          {spec.awards.map((section, index) => (
            <DetailsItem
              key={index}
              style={styles.item}
              title={section.title}
              right={section.date}
              details={section.awarder}
              separator=", "
              summary={section.summary}
            />
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
