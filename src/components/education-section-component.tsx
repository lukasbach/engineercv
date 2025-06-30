import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "./date-range-component.js";
import { defineComponent } from "./define-component.js";
import { detailsItemComponent } from "./details-item-component.js";
import { experienceSectionComponent } from "./experience-section-component.js";
import { listItemComponent } from "./list-item-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { joinComponents } from "./utils.js";

export const educationSectionComponent = defineComponent({
  name: "education",
  schema: z.object({
    strings: z
      .object({
        education: z.string().default("Education"),
        gpa: z.string().default("GPA: "),
        untilNow: z.string().default("Present"),
      })
      .default({}),
    education: z
      .object({
        sections: z.array(
          z.object({
            $id: z.string().optional(),
            title: z.string(),
            institution: z.string().optional(),
            start: z.string().optional(),
            end: z.string().optional(),
            grade: z.string().optional(),
            details: z.string().optional(),
            items: z.string().array().optional(),
          })
        ),
      })
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const ListItem = getComponent(listItemComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    if (!spec.education) return null;
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings?.education}
        </SectionHeader>
        {spec.education.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.institution}
              details={joinComponents([
                section.details,
                section.grade && `${spec.strings?.gpa}${section.grade}`,
              ])}
              right={<DateRange start={section.start} end={section.end} />}
              bottomMargin={!!section.items?.length} />
            {section.items?.map((item, itemIndex) => (
              <ListItem key={itemIndex} style={styles.listItem}>
                {item}
              </ListItem>
            ))}
          </View>
        ))}
      </>
    );
  },
  defaultStyles: experienceSectionComponent.defaultStyles,
});
