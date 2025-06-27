import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import React, { ReactNode } from "react";
import z from "zod";
import ReactMarkdown from "react-markdown";
import { ComponentDefinition, defineComponent } from "./define-component.js";

const joinComponents = (
  components: ReactNode[],
  seperator = "\u00A0–\u00A0",
): ReactNode =>
  components.map((component, index) => (
    <React.Fragment key={index}>
      {component}
      {index < components.length - 1 && <Text>{seperator}</Text>}
    </React.Fragment>
  ));

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

const titleSectionComponent = defineComponent({
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
    summary: {
      marginTop: "8pt",
    },
  } as const,
});

const sectionHeaderComponent = defineComponent({
  name: "sectionHeader",
  schema: z.object({}),
  additionalProps: z.object({ children: z.any(), style: z.any() }),
  component: ({ children, styles, style }) => (
    <Text style={[styles.container, style]}>{children}</Text>
  ),
  defaultStyles: {
    container: {
      borderBottom: "1pt solid black",
      marginTop: "8pt",
      marginBottom: "6pt",
      paddingBottom: "2pt",
      fontSize: "14pt",
    },
  },
});

const listItemComponent = defineComponent({
  name: "listItem",
  schema: z.object({
    strings: z.object({
      bullet: z.string(),
    }),
  }),
  additionalProps: z.object({ children: z.string(), style: z.any() }),
  component: ({ children, styles, style, spec, getComponent }) => {
    const Markdown = getComponent(markdownComponent);
    return (
      <View style={[styles.container, style]}>
        <View style={styles.bullet}>
          <Text>{spec.strings.bullet}</Text>
        </View>
        <View style={styles.text}>
          <Markdown>{children}</Markdown>
        </View>
      </View>
    );
  },
  defaultStyles: {
    container: { display: "flex", flexDirection: "row" },
    bullet: { height: "100%", marginRight: "4pt" },
    text: { flex: 1, lineHeight: ".9" },
  } as const,
});

const detailsItemComponent = defineComponent({
  name: "detailsItem",
  schema: z.object({}),
  additionalProps: z.object({
    style: z.any(),
    title: z.string().optional(),
    details: z.any().optional(),
    right: z.any().optional(),
    separator: z.string().optional(),
  }),
  component: ({
    title,
    details,
    right,
    separator,
    styles,
    style,
    getComponent,
  }) => {
    const Markdown = getComponent(markdownComponent);
    return (
      <View style={[styles.container, style]}>
        <View style={styles.leftContent}>
          {title && <Markdown style={styles.title}>{title}</Markdown>}
          {title && details && <Text>{separator ?? "\u00A0–\u00A0"}</Text>}
          {details && (
            <View style={styles.details}>
              {typeof details === "string" ? (
                <Markdown>{details}</Markdown>
              ) : (
                details
              )}
            </View>
          )}
        </View>
        {right && (
          <View style={styles.rightContent}>
            {typeof right === "string" ? <Markdown>{right}</Markdown> : right}
          </View>
        )}
      </View>
    );
  },
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "4pt",
    },
    title: {
      fontWeight: "bold",
    },
    details: {
      display: "flex",
      flexDirection: "row",
    },
    leftContent: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
    },
    rightContent: {},
  } as const,
});

const dateRangeComponent = defineComponent({
  name: "dateRange",
  schema: z.object({
    strings: z.object({
      untilNow: z.string(),
    }),
  }),
  additionalProps: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
    style: z.any(),
  }),
  component: ({ spec, start, end, styles, style }) => (
    <Text style={[styles.container, style]}>
      {start && `${start} – `}
      {end ?? spec.strings.untilNow}
    </Text>
  ),
  defaultStyles: {
    container: {},
  },
});

const experienceSectionComponent = defineComponent({
  name: "experience",
  schema: z.object({
    strings: z.object({
      experience: z.string(),
      untilNow: z.string(),
    }),
    experience: z.object({
      sections: z.array(
        z.object({
          title: z.string(),
          company: z.string().optional(),
          location: z.string().optional(),
          start: z.string(),
          end: z.string().optional(),
          items: z.string().array().optional(),
        }),
      ),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const ListItem = getComponent(listItemComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings.experience}
        </SectionHeader>
        {spec.experience.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.title}
              right={<DateRange start={section.start} end={section.end} />}
              details={[section.company, section.location]
                .filter(Boolean)
                .join("\u00A0–\u00A0")}
              separator=", "
            />
            {section.items?.map((item, itemIndex) => (
              <ListItem key={itemIndex} style={styles.listItem}>
                {item}
              </ListItem>
            ))}
          </View>
        ))}
      </>
    );
  },
  defaultStyles: {
    container: {},
    header: {},
    section: {
      marginBottom: "8pt",
    },
    details: {},
    listItem: {},
  } as const,
});

const projectsSectionComponent = defineComponent({
  name: "projects",
  schema: z.object({
    strings: z.object({
      projects: z.string(),
      untilNow: z.string(),
    }),
    projects: z.object({
      sections: z.array(
        z.object({
          title: z.string(),
          details: z.string().optional(),
          link: z.string().optional(),
          start: z.string().optional(),
          end: z.string().optional(),
          items: z.string().array().optional(),
        }),
      ),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const ListItem = getComponent(listItemComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings.projects}
        </SectionHeader>
        {spec.projects.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.title}
              details={
                (section.details || section.start) && (
                  <>
                    {section.details && <Text>{section.details}</Text>}
                    {section.details && section.start && (
                      <Text>{",\u00A0"}</Text>
                    )}
                    {section.start && (
                      <DateRange start={section.start} end={section.end} />
                    )}
                  </>
                )
              }
              right={section.link}
              separator=", "
            />
            {section.items?.map((item, itemIndex) => (
              <ListItem key={itemIndex} style={styles.listItem}>
                {item}
              </ListItem>
            ))}
          </View>
        ))}
      </>
    );
  },
  defaultStyles: experienceSectionComponent.defaultStyles,
});

const educationSectionComponent = defineComponent({
  name: "education",
  schema: z.object({
    strings: z.object({
      education: z.string(),
      untilNow: z.string(),
    }),
    education: z.object({
      sections: z.array(
        z.object({
          title: z.string(),
          institution: z.string().optional(),
          start: z.string().optional(),
          end: z.string().optional(),
          grade: z.string().optional(),
          details: z.string().optional(),
          items: z.string().array().optional(),
        }),
      ),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    const ListItem = getComponent(listItemComponent);
    const DetailsItem = getComponent(detailsItemComponent);
    const DateRange = getComponent(dateRangeComponent);
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings.education}
        </SectionHeader>
        {spec.education.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <DetailsItem
              style={styles.details}
              title={section.institution}
              details={section.title}
              right={<DateRange start={section.start} end={section.end} />}
            />
            {section.items?.map((item, itemIndex) => (
              <ListItem key={itemIndex} style={styles.listItem}>
                {item}
              </ListItem>
            ))}
          </View>
        ))}
      </>
    );
  },
  defaultStyles: experienceSectionComponent.defaultStyles,
});

export const defaultComponents = [
  markdownComponent,
  documentComponent,
  pageComponent,
  titleSectionComponent,
  sectionHeaderComponent,
  listItemComponent,
  detailsItemComponent,
  experienceSectionComponent,
  dateRangeComponent,
  projectsSectionComponent,
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
