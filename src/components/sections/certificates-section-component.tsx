import { View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { detailsItemComponent } from "../atoms/details-item-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { detailsListComponent } from "../atoms/details-list-component.js";

export const certificatesSectionSchema = z.object({
  config: z
    .object({
      wrap: z.object({ certificates: z.boolean().nullish() }).nullish(),
    })
    .nullish(),
  strings: z
    .object({
      certificates: z.string().default(""),
    })
    .default({}),
  certificates: z
    .array(
      z.object({
        $id: z.string().nullish(),
        name: z.string(),
        date: z.string().nullish(),
        issuer: z.string().nullish(),
        url: z.string().url().nullish(),
      }),
    )
    .nullish(),
});

export const certificatesSectionComponent = defineComponent({
  name: "certificates" as const,
  schema: certificatesSectionSchema,
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DetailsList = getComponent(detailsListComponent);
    if (!spec.certificates) return null;
    return (
      <View
        style={styles.container}
        wrap={spec.config?.wrap?.certificates ?? true}
      >
        <SectionHeader style={styles.header}>
          {spec.strings?.certificates}
        </SectionHeader>
        <DetailsList>
          {spec.certificates.map((section, index) => (
            <DetailsItem
              key={index}
              style={styles.item}
              title={
                section.url ? `[${section.name}](${section.url})` : section.name
              }
              right={section.date}
              details={section.issuer}
              separator=", "
            />
          ))}
        </DetailsList>
      </View>
    );
  },
  defaultStyles: workSectionComponent.defaultStyles,
});
