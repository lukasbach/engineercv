import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { workSectionComponent } from "./work-section-component.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const publicationsSectionComponent = defineComponent({
  name: "publications" as const,
  schema: z.object({
    strings: z
      .object({
        publications: z.string().default(""),
      })
      .default({}),
    publications: z
      .array(
        z.object({
          $id: z.string().optional(),
          name: z.string(),
          publisher: z.string().optional(),
          releaseDate: z.string().optional(),
          url: z.string().url().optional(),
          summary: z.string().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsList = getComponent(detailsListComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    if (!spec.publications) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.publications}
        </SectionHeader>
        <DetailsList>
          {spec.publications.map((section, index) => (
            <View key={index} style={styles.item}>
              <DetailsItem
                style={styles.item}
                title={
                  section.url
                    ? `[${section.name}](${section.url})`
                    : section.name
                }
                right={section.releaseDate}
                details={joinComponents([section.publisher])}
                separator=", "
                summary={section.summary}
              />
            </View>
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
