import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "../atoms/date-range-component.js";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { urlComponent } from "../atoms/url.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const projectsSectionSchema = z.object({
  config: z
    .object({
      wrap: z.object({ projects: z.boolean().nullish() }).nullish(),
    })
    .nullish(),
  strings: z
    .object({
      projects: z.string().default(""),
      untilNow: z.string().default(""),
    })
    .default({}),
  projects: z
    .array(
      z.object({
        $id: z.string().nullish(),
        name: z.string(),
        startDate: z.string().nullish(),
        endDate: z.string().nullish(),
        description: z.string().nullish(),
        highlights: z.string().array().nullish(),
        url: z.string().url().nullish(),
      }),
    )
    .nullish(),
});

export const projectsSectionComponent = defineComponent({
  name: "projects" as const,
  schema: projectsSectionSchema,
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DetailsList = getComponent(detailsListComponent);
    const DateRange = getComponent(dateRangeComponent);
    const Url = getComponent(urlComponent);
    if (!spec.projects) return null;
    return (
      <View style={styles.container} wrap={spec.config?.wrap?.projects ?? true}>
        <SectionHeader style={styles.header}>
          {spec.strings?.projects}
        </SectionHeader>
        <DetailsList>
          {spec.projects.map((project, index) => (
            <DetailsItem
              key={index}
              style={styles.item}
              title={project.name}
              details={joinComponents([
                project.url ? (
                  <DateRange start={project.startDate} end={project.endDate} />
                ) : null,
              ])}
              right={
                project.url ? (
                  <Url url={project.url} />
                ) : (
                  <DateRange start={project.startDate} end={project.endDate} />
                )
              }
              separator=", "
              summary={project.description}
              list={project.highlights}
            />
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
