import React from "react";
import z from "zod";
import { View } from "@react-pdf/renderer";
import { defineComponent } from "../define-component.js";
import { iconComponent } from "./icon.js";

export const textWithIconComponent = defineComponent({
  name: "textWithIcon",
  schema: z.object({}),
  additionalProps: z.object({
    icon: z.string().optional(),
    suite: z.string().optional(),
    children: z.any().nullish(),
    right: z.boolean().nullish(),
  }),
  component: ({ icon, suite, children, right, styles, getComponent }) => {
    const Icon = getComponent(iconComponent);
    return (
      <View style={styles.container}>
        {right && <View style={styles.text}>{children}</View>}
        {icon && (
          <View style={styles.icon}>
            <Icon icon={icon} suite={suite} size="12pt" />
          </View>
        )}
        {!right && <View style={styles.text}>{children}</View>}
      </View>
    );
  },
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "4pt",
    },
    text: {},
    icon: {},
  } as const,
});
