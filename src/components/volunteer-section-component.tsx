import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "./date-range-component.js";
import { defineComponent } from "./define-component.js";
import { detailsItemComponent } from "./details-item-component.js";
import { listItemComponent } from "./list-item-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { joinComponents } from "./utils.js";
import { markdownComponent } from "./markdown-component.js";

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
    const ListItem = getComponent(listItemComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    const Markdown = getComponent(markdownComponent);
    if (!spec.volunteer) return null;
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings?.volunteer}
        </SectionHeader>
        {spec.volunteer.map((section, index) => (
          <View key={index} style={styles.section}>
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
              bottomMargin={!!section.highlights?.length || !!section.summary}
            />
            <Markdown style={styles.summary} children={section.summary ?? ""} />
            {section.highlights?.map((item, itemIndex) => (
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
    summary: {},
  } as const,
});
