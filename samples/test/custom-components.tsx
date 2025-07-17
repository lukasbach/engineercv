import "../../src/module-globals.js";
// Outside this repo, use `import "engineercv/module-globals";`

const basics = defineComponent({
  name: "basics",
  schema: z.object({
    basics: z.object({ name: z.string() }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({name: "markdown"});
    return (
      <ReactPdf.View style={styles.container}>
        <Markdown style={styles.name}>{spec.basics.name}</Markdown>
        <Markdown style={styles.summary}>This is my awesome custom component!</Markdown>
      </ReactPdf.View>
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
    summary: {
      marginTop: "8pt",
      marginBottom: "8pt",
    },
  },
});

export default {
  config: { 
    components: { basics }
  },
};