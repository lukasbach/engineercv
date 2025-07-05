import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { workSectionComponent } from "./work-section-component.js";

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
          $id: z.string().optional(),
          title: z.string(),
          date: z.string().optional(),
          awarder: z.string().optional(),
          summary: z.string().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    if (!spec.awards) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.awards}
        </SectionHeader>
        {spec.awards.map((section, index) => (
          <View key={index} style={styles.item}>
            <DetailsItem
              style={styles.details}
              title={section.title}
              right={section.date}
              details={joinComponents([section.awarder])}
              separator=", "
              summary={section.summary}
            />
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
