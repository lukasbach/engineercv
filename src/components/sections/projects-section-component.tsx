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

export const projectsSectionComponent = defineComponent({
  name: "projects" as const,
  schema: z.object({
    strings: z
      .object({
        projects: z.string().default(""),
        untilNow: z.string().default(""),
      })
      .default({}),
    projects: z
      .array(
        z.object({
          $id: z.string().optional(),
          name: z.string(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          description: z.string().optional(),
          highlights: z.string().array().optional(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    const Url = getComponent(urlComponent);
    if (!spec.projects) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.projects}
        </SectionHeader>
        {spec.projects.map((project, index) => (
          <View key={index} style={styles.item}>
            <DetailsItem
              style={styles.details}
              title={project.name}
              details={joinComponents([
                <DateRange start={project.startDate} end={project.endDate} />,
              ])}
              right={<Url url={project.url} />}
              separator=", "
              list={project.highlights}
            />
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
