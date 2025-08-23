import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "../atoms/date-range-component.js";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const educationSectionSchema = z.object({
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
        $id: z.string().nullish(),
        institution: z.string().nullish(),
        url: z.string().url().nullish(),
        area: z.string().nullish(),
        studyType: z.string().nullish(),
        startDate: z.string().nullish(),
        endDate: z.string().nullish(),
        score: z.string().or(z.number()).nullish(),
        courses: z.string().array().nullish(),
        summary: z.string().nullish(),
      }),
    )
    .nullish(),
});

export const educationSectionComponent = defineComponent({
  name: "education" as const,
  schema: educationSectionSchema,
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    const DetailsList = getComponent(detailsListComponent);
    if (!spec.education) return null;

    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.education}
        </SectionHeader>
        <DetailsList>
          {spec.education.map((section, index) => (
            <DetailsItem
              key={index}
              style={styles.item}
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
              detailsInExtraLine={Boolean(
                section.area && section.studyType && section.score,
              )}
              right={
                <DateRange start={section.startDate} end={section.endDate} />
              }
              list={section.courses}
              summary={section.summary}
            />
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
