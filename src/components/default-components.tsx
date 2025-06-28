import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import React, { ReactNode } from "react";
import z from "zod";
import ReactMarkdown from "react-markdown";
import { ComponentDefinition, defineComponent } from "./define-component.js";

const joinComponents = (
  components: (ReactNode | null)[],
  seperator = "\u00A0–\u00A0",
): ReactNode =>
  components.filter(Boolean).map((component, index, arr) => (
    <React.Fragment key={index}>
      <Text>{component}</Text>
      {index < arr.length - 1 && <Text>{seperator}</Text>}
    </React.Fragment>
  ));

const markdownComponent = defineComponent({
  name: "markdown",
  schema: z.object({}),
  additionalProps: z.object({ children: z.any(), style: z.any().optional() }),
  // https://www.npmjs.com/package/react-markdown#appendix-b-components
  component: ({ children, styles, style }) =>
    // eslint-disable-next-line no-nested-ternary
    !children ? null : typeof children === "string" ? (
      <Text style={style}>
        <ReactMarkdown
          components={{
            p: (props) => (
              <Text style={styles.paragraph}>{props.children}</Text>
            ),
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
    ) : (
      children
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
      marginBottom: "8pt",
      marginTop: "8pt",
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
      marginBottom: "8pt",
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
    bottomMargin: z.boolean().optional(),
  }),
  component: ({
    title,
    details,
    right,
    separator,
    styles,
    style,
    getComponent,
    bottomMargin,
  }) => {
    const Markdown = getComponent(markdownComponent);
    return (
      <View
        style={[styles.container, style, bottomMargin && styles.bottomMargin]}
      >
        <View style={styles.leftContent}>
          {joinComponents(
            [
              <Markdown style={styles.title}>{title}</Markdown>,
              <Markdown style={styles.details}>{details}</Markdown>,
            ],
            separator,
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
    },
    bottomMargin: {
      marginBottom: "6pt",
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
              details={joinComponents([section.company, section.location])}
              separator=", "
              bottomMargin={!!section.items?.length}
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
              details={joinComponents([
                section.details,
                <DateRange start={section.start} end={section.end} />,
              ])}
              right={section.link}
              separator=", "
              bottomMargin={!!section.items?.length}
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
      gpa: z.string(),
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
              details={joinComponents([
                section.details,
                section.grade && `${spec.strings.gpa}${section.grade}`,
              ])}
              right={<DateRange start={section.start} end={section.end} />}
              bottomMargin={!!section.items?.length}
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

const skillsSectionComponent = defineComponent({
  name: "skills",
  schema: z.object({
    strings: z.object({
      skills: z.string(),
    }),
    skills: z.object({
      sections: z.array(
        z.object({
          title: z.string(),
          items: z.string().array(),
        }),
      ),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent(sectionHeaderComponent);
    return (
      <>
        <SectionHeader style={styles.header}>
          {spec.strings.skills}
        </SectionHeader>
        {spec.skills.sections.map((section, index) => (
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
  educationSectionComponent,
  skillsSectionComponent,
];

const baseSpecSchema = z.object({
  styles: z.any().optional(),
  imports: z.string().array().optional(),
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
  specSchema: components
    .reduce(
      (prev, { schema }) => z.intersection(prev, schema),
      baseSpecSchema as z.ZodType<any>,
    ),
});

export type ComponentRegistry = ReturnType<typeof buildComponentRegistry>;
