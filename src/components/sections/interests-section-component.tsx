import { Text, View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";
import { skillsSectionComponent } from "./skill-section-component.js";

export const interestsSectionComponent = defineComponent({
  name: "interests" as const,
  schema: z.object({
    strings: z
      .object({
        interests: z.string().default(""),
      })
      .default({}),
    interests: z
      .array(
        z.object({
          $id: z.string().nullish(),
          name: z.string(),
          keywords: z.string().array().nullish(),
        }),
      )
      .nullish(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    if (!spec.interests) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.interests}
        </SectionHeader>
        {spec.interests.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {section.name}:{"\u00A0"}
            </Text>
            {section.keywords &&
              joinComponents(
                section.keywords.map((item, itemIndex) => (
                  <Text key={itemIndex} style={styles.item}>
                    {item}
                  </Text>
                )),
                ", ",
              )}
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: skillsSectionComponent.defaultStyles,
});
