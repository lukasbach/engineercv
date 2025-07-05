import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "../atoms/date-range-component.js";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { workSectionComponent } from "./work-section-component.js";

export const volunteerSectionComponent = defineComponent({
  name: "volunteer" as const,
  schema: z.object({
    strings: z
      .object({
        volunteer: z.string().default(""),
        untilNow: z.string().default(""),
      })
      .default({}),
    volunteer: z
      .array(
        z.object({
          $id: z.string().optional(),
          organization: z.string(),
          position: z.string(),
          url: z.string().url().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          summary: z.string().optional(),
          highlights: z.string().array().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    if (!spec.volunteer) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.volunteer}
        </SectionHeader>
        {spec.volunteer.map((section, index) => (
          <View key={index} style={styles.item}>
            <DetailsItem
              style={styles.details}
              title={section.position}
              right={
                <DateRange start={section.startDate} end={section.endDate} />
              }
              details={joinComponents([
                section.url
                  ? `[${section.organization}](${section.url})`
                  : section.organization,
              ])}
              separator=", "
              summary={section.summary}
              list={section.highlights}
            />
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
