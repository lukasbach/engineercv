import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { dateRangeComponent } from "./date-range-component.js";
import { defineComponent } from "./define-component.js";
import { detailsItemComponent } from "./details-item-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { listItemComponent } from "./list-item-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { joinComponents } from "./utils.js";

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
          title: z.string(),
          details: z.string().optional(),
          link: z.string().optional(),
          start: z.string().optional(),
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
    if (!spec.projects) return null;
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings?.projects}
        </SectionHeader>
        {spec.projects.map((project, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={project.title}
              details={joinComponents([
                project.details,
                <DateRange start={project.start} end={project.end} />,
              ])}
              right={project.link}
              separator=", "
              bottomMargin={!!project.items?.length}
            />
            {project.items?.map((item, itemIndex) => (
              <ListItem key={itemIndex} style={styles.listItem}>
                {item}
              </ListItem>
            ))}
          </View>
        ))}
      </>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
