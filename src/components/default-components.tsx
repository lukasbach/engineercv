import { Document, Page, View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import { ComponentDefinition, defineComponent } from "./define-component.js";
import { PdfMarkdown } from "./pdf-markdown.js";

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
    config: z.object({
      size: z.string(),
    }),
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
          <PdfMarkdown key={index} style={styles.titleText}>
            {item}
          </PdfMarkdown>
        ))}
        {spec.title.summary && (
          <PdfMarkdown style={styles.titleSummary}>
            {spec.title.summary}
          </PdfMarkdown>
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
  parseSpec: (spec: any) =>
    components
      .reduce(
        (prev, { schema }) => z.intersection(prev, schema),
        z.object({}) as z.ZodType<any>,
      )
      .parse(spec),
});

export type ComponentRegistry = ReturnType<typeof buildComponentRegistry>;
