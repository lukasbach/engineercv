import { Text, View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";

export const languagesSectionComponent = defineComponent({
  name: "languages" as const,
  schema: z.object({
    strings: z
      .object({
        languages: z.string().default(""),
      })
      .default({}),
    languages: z
      .array(
        z.object({
          $id: z.string().optional(),
          language: z.string(),
          fluency: z.string().optional(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    if (!spec.languages) return null;
    return (
      <View wrap={false}>
        <SectionHeader style={styles.header}>
          {spec.strings?.languages}
        </SectionHeader>
        {spec.languages.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {section.language}:{"\u00A0"}
            </Text>
            {section.fluency && (
              <Text style={styles.item}>{section.fluency}</Text>
            )}
          </View>
        ))}
      </View>
    );
  },
  defaultStyles: {
    header: {},
    section: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "4pt",
    },
    sectionTitle: {
      fontWeight: "bold",
    },
    item: {},
  } as const,
});
