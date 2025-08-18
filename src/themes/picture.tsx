import React from "react";
import type { basicsItemsComponent } from "../components/atoms/basics-items-component.js";
import "../module-globals.js";

const basics = defineComponent({
  name: "basics",
  schema: z.intersection(
    defaultComponents.basics.schema,
    z.object({
      basics: z
        .object({
          image: z.string(),
          roundedImage: z.boolean().nullish(),
        })
        .nullish(),
    }),
  ),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    const Image = getComponent(defaultComponents.image);
    const TextWithIcon = getComponent(defaultComponents.textWithIcon);
    const BasicsItems = getComponent({
      name: "basicsItems",
    } as typeof basicsItemsComponent);

    return (
      spec.basics && (
        <>
          <ReactPdf.View style={styles.container}>
            <ReactPdf.View style={styles.leftContainer}>
              <Image
                src={spec.basics.image}
                style={[
                  styles.picture,
                  spec.basics.roundedImage ? { borderRadius: "9999pt" } : {},
                ]}
              />
            </ReactPdf.View>
            <ReactPdf.View style={styles.rightContainer}>
              <Markdown style={styles.name}>{spec.basics.name}</Markdown>
              <ReactPdf.View style={styles.itemContainer}>
                <BasicsItems
                  renderItem={(item, icon, key) => (
                    <TextWithIcon
                      suite={icon?.suite}
                      icon={icon?.icon}
                      key={key}
                    >
                      <Markdown style={styles.item}>{item}</Markdown>
                    </TextWithIcon>
                  )}
                />
              </ReactPdf.View>
            </ReactPdf.View>
          </ReactPdf.View>

          {spec.basics.summary && (
            <Markdown style={styles.summary}>{spec.basics.summary}</Markdown>
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
      rowGap: "4pt",
      columnGap: "12pt",
    },
    item: {
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
