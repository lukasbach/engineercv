import React from "react";
import "../module-globals.js";

const wipText = defineComponent({
  name: "wipText",
  schema: z.object({
    strings: z.object({
      wip: z.string().nullish(),
    }),
    wip: z.boolean().nullish(),
  }),
  component: ({ spec, styles }) => {
    return (
      spec.wip && (
        <ReactPdf.View style={styles.container}>
          {spec.strings.wip ?? "Work In Progress"}
        </ReactPdf.View>
      )
    );
  },
  defaultStyles: {
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 24,
    },
  } as const,
});

export default {
  order: ["{{ rest }}", "wipText"],
  config: {
    components: { wipText },
  },
};
