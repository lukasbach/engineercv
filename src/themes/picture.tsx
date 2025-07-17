import "../module-globals.js";
import React from "react";

const basics = defineComponent({
  name: "basics",
  schema: z.object({
    basics: z.object({ name: z.string() }),
    title: z
      .object({
        items: z.string().array().optional(),
        image: z.string(),
        rounded: z.boolean().optional(),
        summary: z.string().optional(),
      })
      .optional(),
  }),
  component: ({ spec, styles, getComponent, resolvePath }) => {
    const Markdown = getComponent({ name: "markdown" });
    return (
      spec.title && (
        <>
          <ReactPdf.View style={styles.container}>
            <ReactPdf.View style={styles.leftContainer}>
              <ReactPdf.Image
                src={resolvePath(spec.title.image)}
                style={[
                  styles.picture,
                  spec.title.rounded ? { borderRadius: "9999pt" } : {},
                ]}
              />
            </ReactPdf.View>
            <ReactPdf.View style={styles.rightContainer}>
              <Markdown style={styles.name}>{spec.basics.name}</Markdown>
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
            </ReactPdf.View>
          </ReactPdf.View>
          {spec.title.summary && (
            <Markdown style={styles.summary}>{spec.title.summary}</Markdown>
          )}
        </>
      )
    );
  },
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    leftContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    rightContainer: {
      marginLeft: "8pt",
      flexGrow: 1,
    },
    name: {
      fontSize: "24pt",
      marginBottom: "8pt",
    },
    itemContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
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
    picture: {
      width: "100px",
      overflow: "hidden",
    },
  } as const,
});

export default {
  config: {
    components: { basics },
  },
};
