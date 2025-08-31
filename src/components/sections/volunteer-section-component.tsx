import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "../atoms/date-range-component.js";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { workSectionComponent } from "./work-section-component.js";
import { urlComponent } from "../atoms/url.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const volunteerSectionSchema = z.object({
  strings: z
    .object({
      volunteer: z.string().default(""),
      untilNow: z.string().default(""),
    })
    .default({}),
  volunteer: z
    .array(
      z.object({
        $id: z.string().nullish(),
        organization: z.string(),
        position: z.string(),
        url: z.string().url().nullish(),
        startDate: z.string().nullish(),
        endDate: z.string().nullish(),
        summary: z.string().nullish(),
        highlights: z.string().array().nullish(),
      }),
    )
    .nullish(),
});

export const volunteerSectionComponent = defineComponent({
  name: "volunteer" as const,
  schema: volunteerSectionSchema,
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsList = getComponent(detailsListComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    const Url = getComponent(urlComponent);
    if (!spec.volunteer) return null;
    return (
      <View style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.volunteer}
        </SectionHeader>
        <DetailsList>
          {spec.volunteer.map((section, index) => (
            <DetailsItem
              key={index}
              style={styles.item}
              title={section.position}
              right={
                <DateRange start={section.startDate} end={section.endDate} />
              }
              details={joinComponents([
                <Url url={section.url} text={section.organization} />,
              ])}
              separator=", "
              summary={section.summary}
              list={section.highlights}
            />
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
