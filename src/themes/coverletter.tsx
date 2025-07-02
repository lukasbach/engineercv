import "../module-globals.js";
import React from "react";

const header = defineComponent({
  name: "header",
  schema: z.object({
    info: z.object({ name: z.string(), subtitle: z.string().optional() }),
    fromAddress: z.string().array().optional(),
    date: z.string().optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    return (
      <>
        <ReactPdf.View style={styles.container}>
          <Markdown style={styles.title}>{spec.info.name}</Markdown>

          <ReactPdf.View style={styles.innerContainer}>
            <Markdown style={styles.subtitle}>{spec.info.subtitle}</Markdown>
            <Markdown style={styles.address}>
              {spec.fromAddress?.join("\n")}
            </Markdown>
          </ReactPdf.View>

          <Markdown style={styles.date}>{spec.date}</Markdown>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: {
      marginTop: "8pt",
    },
    innerContainer: {
      display: "flex",
      flexDirection: "row",
      borderBottom: "1pt solid #666666",
      paddingBottom: "8pt",
      marginBottom: "8pt",
    },
    title: {
      fontSize: "34pt",
      textTransform: "uppercase",
      letterSpacing: "4pt",
      marginBottom: "4pt",
    },
    subtitle: {
      fontSize: "16pt",
      flexGrow: 1,
    },
    address: {
      textAlign: "right",
      fontStyle: "italic",
      lineHeight: ".85",
    },
    date: {
      textAlign: "right",
    },
  } as const,
});

const toAddress = defineComponent({
  name: "toAddress",
  schema: z.object({
    toAddress: z.string().array().optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    return (
      <>
        <ReactPdf.View style={styles.container}>
          <Markdown style={styles.address}>
            {spec.toAddress?.join("\n")}
          </Markdown>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: {},
    address: {
      lineHeight: ".85",
    },
  } as const,
});

const body = defineComponent({
  name: "body",
  schema: z.object({
    subject: z.string().optional(),
    body: z.string(),
    config: z.object({ paragraphSpacing: z.string().optional() }).optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    return (
      <>
        <ReactPdf.View style={styles.container}>
          <Markdown style={styles.subject}>{spec.subject}</Markdown>
          <Markdown
            style={styles.body}
            paragraphSpacing={spec.config?.paragraphSpacing ?? "14pt"}
          >
            {spec.body}
          </Markdown>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: { marginTop: "20pt" },
    subject: { fontSize: "16pt", marginBottom: "14pt" },
    body: {},
  } as const,
});

export default {
  config: {
    components: {
      header,
      toAddress,
      body,
    },
  },
  order: ["header", "toAddress", "body"],
};
