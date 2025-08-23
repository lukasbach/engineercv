import { Text, View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "../define-component.js";
import { sectionHeaderComponent } from "../atoms/section-header-component.js";
import { joinComponents } from "../utils.js";

export const skillsSectionSchema = z.object({
  strings: z
    .object({
      skills: z.string().default(""),
    })
    .default({}),
  skills: z
    .array(
      z.object({
        $id: z.string().nullish(),
        name: z.string(),
        level: z.string().nullish(),
        keywords: z.string().array().nullish(),
      }),
    )
    .nullish(),
});

export const skillsSectionComponent = defineComponent({
  name: "skills" as const,
  schema: skillsSectionSchema,
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    if (!spec.skills) return null;
    return (
      <View wrap={false} style={styles.container}>
        <SectionHeader style={styles.header}>
          {spec.strings?.skills}
        </SectionHeader>
        {spec.skills
          .filter((section) => (section.keywords?.length ?? 0) > 0)
          .map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {section.name}:{"\u00A0"}
              </Text>
              {joinComponents(
                section.keywords?.map((item, itemIndex) => (
                  <Text key={itemIndex} style={styles.item}>
                    {item}
                  </Text>
                )) ?? [],
                ", ",
              )}
            </View>
          ))}
      </View>
    );
  },
  defaultStyles: {
    container: {},
    header: {},
    section: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: "6pt",
      lineHeight: 0.9,
    },
    sectionTitle: {
      fontWeight: "bold",
    },
    item: {},
  } as const,
});
