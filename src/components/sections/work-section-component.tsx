import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "../atoms/date-range-component.js";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { listItemComponent } from "../atoms/list-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { markdownComponent } from "../atoms/markdown-component.js";

export const workSectionComponent = defineComponent({
  name: "work" as const,
  schema: z.object({
    strings: z
      .object({
        work: z.string().default(""),
        untilNow: z.string().default(""),
      })
      .default({}),
    work: z
      .array(
        z.object({
          $id: z.string().optional(),
          name: z.string().optional(),
          position: z.string(),
          url: z.string().url().optional(),
          location: z.string().optional(),
          startDate: z.string(),
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
    if (!spec.work) return null;
    return (
      <View wrap={false}>
        <SectionHeader style={styles.header}>
          {spec.strings?.work}
        </SectionHeader>
        {spec.work.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.position}
              right={
                <DateRange start={section.startDate} end={section.endDate} />
              }
              details={joinComponents([section.name, section.location])}
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
      </View>
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
