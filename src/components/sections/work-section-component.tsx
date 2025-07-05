import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "../atoms/date-range-component.js";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

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
    if (!spec.work) return null;
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DetailsList = getComponent(detailsListComponent);
    const DateRange = getComponent(dateRangeComponent);
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.work}
        </SectionHeader>
        <DetailsList>
          {spec.work.map((section, index) => (
            <DetailsItem
              key={index}
              style={styles.item}
              title={section.position}
              right={
                <DateRange start={section.startDate} end={section.endDate} />
              }
              details={joinComponents([section.name, section.location])}
              separator=", "
              summary={section.summary}
              list={section.highlights}
            />
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: {
    container: {},
    header: {},
    item: {},
  } as const,
});
