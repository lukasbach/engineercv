import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const awardsSectionComponent = defineComponent({
  name: "awards" as const,
  schema: z.object({
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
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DetailsList = getComponent(detailsListComponent);
    if (!spec.awards) return null;
    return (
      <View wrap={false} style={styles.container}>
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
