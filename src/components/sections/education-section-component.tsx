import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "../atoms/date-range-component.js";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { listItemComponent } from "../atoms/list-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";

export const educationSectionComponent = defineComponent({
  name: "education" as const,
  schema: z.object({
    strings: z
      .object({
        education: z.string().default(""),
        gpa: z.string().default(""),
        untilNow: z.string().default(""),
      })
      .default({}),
    education: z
      .array(
        z.object({
          $id: z.string().optional(),
          institution: z.string().optional(),
          url: z.string().url().optional(),
          area: z.string().optional(),
          studyType: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          score: z.string().optional(),
          courses: z.string().array().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const ListItem = getComponent(listItemComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    if (!spec.education) return null;
    return (
      <View wrap={false}>
        <SectionHeader style={styles.header}>
          {spec.strings?.education}
        </SectionHeader>
        {spec.education.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={
                section.url
                  ? `[${section.institution}](${section.url})`
                  : section.institution
              }
              details={joinComponents([
                section.area,
                section.studyType,
                section.score && `${spec.strings?.gpa}${section.score}`,
              ])}
              right={
                <DateRange start={section.startDate} end={section.endDate} />
              }
              bottomMargin={!!section.courses?.length}
            />
            {section.courses?.map((item, itemIndex) => (
              <ListItem key={itemIndex} style={styles.listItem}>
                {item}
              </ListItem>
            ))}
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
