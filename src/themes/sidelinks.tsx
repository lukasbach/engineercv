import "../module-globals.js";
import React from "react";

export const basics = defineComponent({
  name: "basics" as const,
  schema: defaultComponents.basics.schema,
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent(defaultComponents.markdown);
    const BasicsItems = getComponent(defaultComponents.basicsItems);

    return (
      <ReactPdf.View style={styles.container}>
        <ReactPdf.View style={styles.leftContainer}>
          <Markdown style={styles.name}>{spec.basics.name}</Markdown>
          <ReactPdf.View>
            {spec.basics.summary && (
              <Markdown style={styles.summary}>{spec.basics.summary}</Markdown>
            )}
          </ReactPdf.View>
        </ReactPdf.View>
        <ReactPdf.View style={styles.rightContainer}>
          <ReactPdf.View style={styles.itemContainer}>
            <BasicsItems
              renderItem={(item, key) => (
                <ReactPdf.View style={styles.item} key={key}>
                  <Markdown>{item}</Markdown>
                </ReactPdf.View>
              )}
            />
          </ReactPdf.View>
        </ReactPdf.View>
      </ReactPdf.View>
    );
  },
  defaultStyles: {
    container: {
      ...defaultComponents.basics.defaultStyles.container,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "8pt",
    },
    name: {
      ...defaultComponents.basics.defaultStyles.name,
      fontSize: "28pt",
      textAlign: "left",
    },
    itemContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      textAlign: "right",
      gap: "4pt",
    },
    item: defaultComponents.basics.defaultStyles.item,
    summary: defaultComponents.basics.defaultStyles.summary,
    leftContainer: {
      flex: 1,
    },
    rightContainer: {},
  } as const,
});

export default {
  config: {
    components: { basics },
  },
};
