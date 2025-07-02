import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "./date-range-component.js";
import { defineComponent } from "./define-component.js";
import { detailsItemComponent } from "./details-item-component.js";
import { listItemComponent } from "./list-item-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { joinComponents } from "./utils.js";

export const experienceSectionComponent = defineComponent({
  name: "experience" as const,
  schema: z.object({
    strings: z
      .object({
        experience: z.string().default(""),
        untilNow: z.string().default(""),
      })
      .default({}),
    experience: z
      .array(
        z.object({
          $id: z.string().optional(),
          title: z.string(),
          company: z.string().optional(),
          location: z.string().optional(),
          start: z.string(),
          end: z.string().optional(),
          items: z.string().array().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const ListItem = getComponent(listItemComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    if (!spec.experience) return null;
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings?.experience}
        </SectionHeader>
        {spec.experience.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.title}
              right={<DateRange start={section.start} end={section.end} />}
              details={joinComponents([section.company, section.location])}
              separator=", "
              bottomMargin={!!section.items?.length}
            />
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
  defaultStyles: {
    container: {},
    header: {},
    section: {
      marginBottom: "8pt",
    },
    details: {},
    listItem: {},
  } as const,
});
