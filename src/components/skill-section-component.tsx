import { Text, View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { joinComponents } from "./utils.js";

export const skillsSectionComponent = defineComponent({
  name: "skills" as const,
  schema: z.object({
    strings: z
      .object({
        skills: z.string().default(""),
      })
      .default({}),
    skills: z
      .array(
        z.object({
          $id: z.string().optional(),
          title: z.string(),
          items: z.string().array(),
        }),
      )
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    if (!spec.skills) return null;
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings?.skills}
        </SectionHeader>
        {spec.skills.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {section.title}:{"\u00A0"}
            </Text>
            {joinComponents(
              section.items.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.item}>
                  {item}
                </Text>
              )),
              ", ",
            )}
          </View>
        ))}
      </>
    );
  },
  defaultStyles: {
    header: {},
    section: {
      display: "flex",
      flexDirection: "row",
    },
    sectionTitle: {
      fontWeight: "bold",
    },
    item: {},
  } as const,
});
