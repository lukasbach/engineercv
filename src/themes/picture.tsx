import "../module-globals.js";
import React from "react";

const title = defineComponent({
  name: "title",
  schema: z.object({
    info: z.object({ name: z.string() }),
    title: z
      .object({
        items: z.string().array().optional(),
        image: z.string(),
        summary: z.string().optional(),
      })
      .optional(),
  }),
  component: ({ spec, styles, getComponent, resolvePath }) => {
    const Markdown = getComponent({ name: "markdown" });
    return (
      spec.title && (
        <ReactPdf.View style={styles.container}>
          <ReactPdf.Image src={resolvePath(spec.title.image)} />
          <Markdown style={styles.name}>!!!{spec.info.name}</Markdown>
          <Markdown style={styles.summary}>
            This is my awesome custom component!
          </Markdown>
          <ReactPdf.View style={styles.itemContainer}>
            {spec.title.items?.map((item, index) => (
              <Markdown
                key={index}
                style={[styles.item, index === 0 ? styles.firstItem : {}]}
              >
                {item}
              </Markdown>
            ))}
          </ReactPdf.View>
          {spec.title.summary && (
            <Markdown style={styles.summary}>{spec.title.summary}</Markdown>
          )}
        </ReactPdf.View>
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

export default {
  config: {
    components: { title },
  },
};
