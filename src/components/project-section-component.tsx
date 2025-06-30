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

export const projectsSectionComponent = defineComponent({
  name: "projects",
  schema: z.object({
    strings: z
      .object({
        projects: z.string().default("Projects"),
        untilNow: z.string().default("Present"),
      })
      .default({}),
    projects: z
      .object({
        sections: z.array(
          z.object({
            $id: z.string().optional(),
            title: z.string(),
            details: z.string().optional(),
            link: z.string().optional(),
            start: z.string().optional(),
            end: z.string().optional(),
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
    if (!spec.projects) return null;
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings?.projects}
        </SectionHeader>
        {spec.projects.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.title}
              details={joinComponents([
                section.details,
                <DateRange start={section.start} end={section.end} />,
              ])}
              right={section.link}
              separator=", "
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
