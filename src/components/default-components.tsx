import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import React from "react";
import z from "zod";
import ReactMarkdown from "react-markdown";
import { ComponentDefinition, defineComponent } from "./define-component.js";

const markdownComponent = defineComponent({
  name: "markdown",
  schema: z.object({}),
  additionalProps: z.object({ children: z.any(), style: z.any().optional() }),
  // https://www.npmjs.com/package/react-markdown#appendix-b-components
  component: ({ children, styles, style }) => (
    <Text style={style}>
      <ReactMarkdown
        components={{
          p: (props) => <Text style={styles.paragraph}>{props.children}</Text>,
          a: (props) => (
            <Link src={props.href} style={styles.link}>
              {props.children}
            </Link>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </Text>
  ),
  defaultStyles: {
    link: { color: "black", textDecoration: "none" },
    paragraph: {},
  } as const,
});

const documentComponent = defineComponent({
  name: "document",
  schema: z.object({}),
  additionalProps: z.object({ children: z.any() }),
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
  additionalProps: z.object({ children: z.any(), test: z.string() }),
  component: ({ children, styles, spec }) => (
    <Page size={spec.config?.size as any} style={styles.page}>
      {children}
    </Page>
  ),
  defaultStyles: {
    page: {
      paddingHorizontal: 20,
      paddingVertical: 35,
      fontSize: 12,
    },
  },
});

const titleComponent = defineComponent({
  name: "title",
  schema: z.object({
    info: z.object({ name: z.string() }),
    title: z
      .object({
        items: z.string().array().optional(),
        summary: z.string().optional(),
      })
      .optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent(markdownComponent);
    return (
      spec.title && (
        <View style={styles.container}>
          <Markdown style={styles.name}>{spec.info.name}</Markdown>
          <View style={styles.itemContainer}>
            {spec.title.items?.map((item, index) => (
              <Markdown
                key={index}
                style={[styles.item, index === 0 ? styles.firstItem : {}]}
              >
                {item}
              </Markdown>
            ))}
          </View>
          {spec.title.summary && (
            <Markdown style={styles.summary}>{spec.title.summary}</Markdown>
          )}
        </View>
      )
    );
  },
  defaultStyles: {
    container: {},
    name: {
      fontSize: "24pt",
      textAlign: "center",
    },
    itemContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    item: {
      borderLeft: "1pt solid black",
      paddingLeft: "5pt",
      marginLeft: "5pt",
      color: "black",
    },
    firstItem: {
      borderLeft: "none",
      paddingLeft: 0,
      marginLeft: 0,
    },
    summary: {},
  } as const,
});

export const defaultComponents = [
  markdownComponent,
  documentComponent,
  pageComponent,
  titleComponent,
];

const baseSpecSchema = z.object({
  styles: z.any().optional(),
});

export const buildComponentRegistry = (
  components: ComponentDefinition<any, any, any>[] = defaultComponents,
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
        baseSpecSchema as z.ZodType<any>,
      )
      .parse(spec),
});

export type ComponentRegistry = ReturnType<typeof buildComponentRegistry>;
