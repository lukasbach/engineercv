import { Document, Page, Text, View } from "@react-pdf/renderer";
import React, { FC } from "react";
import z from "zod";
import { ComponentDefinition, defineComponent } from "./define-component.js";

const documentComponent = defineComponent({
  name: "document",
  schema: z.object({}),
  component: ({ children, styles }) => (
    <Document style={styles.document}>{children}</Document>
  ),
  defaultStyles: { document: {} },
});

const pageComponent = defineComponent({
  name: "page",
  schema: z.object({
    config: z
      .object({
        size: z.string().optional(),
      })
      .optional(),
  }),
  component: ({ children, styles, spec }) => (
    <Page size={spec.config?.size as any} style={styles.page}>
      {children}
    </Page>
  ),
  defaultStyles: { page: {} },
});

const titleComponent = defineComponent({
  name: "title",
  schema: z.object({
    info: z.object({ name: z.string().optional() }).optional(),
    title: z
      .object({
        items: z.string().array().optional(),
        summary: z.string().optional(),
      })
      .optional(),
  }),
  component: ({ spec, styles }) =>
    spec.title && (
      <View style={styles.title}>
        {spec.title.items?.map((item, index) => (
          <Text key={index} style={styles.titleText}>
            {item}
          </Text>
        ))}
        {spec.title.summary && (
          <Text style={styles.titleSummary}>{spec.title.summary}</Text>
        )}
      </View>
    ),
  defaultStyles: { title: {}, titleText: {}, titleSummary: {} },
});

export const defaultComponents = [
  documentComponent,
  pageComponent,
  titleComponent,
];

export const buildComponentRegistry = (
  components: ComponentDefinition<any, any>[] = defaultComponents,
) => ({
  all: components,
  getComponent: (name: string) => {
    const component = components.find((c) => c.name === name);
    if (!component) {
      throw new Error(`Component ${name} not found`);
    }
    return component;
  },
  get: new Proxy<Record<string, FC<any>>>(
    {},
    {
      get: (_, name: string) => {
        const component = components.find((c) => c.name === name);
        if (!component) {
          throw new Error(`Component ${name} not found`);
        }
        return component;
      },
    },
  ),
});

export type ComponentRegistry = ReturnType<typeof buildComponentRegistry>;
