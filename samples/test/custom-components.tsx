// import z from 'zod';
// import { defineComponent } from '../../src/components/define-component';
// import { View } from '@react-pdf/renderer';

const title = defineComponent({
  name: "title",
  schema: z.object({
    info: z.object({ name: z.string() }),
  }),
  component: ({ spec, styles, getComponent }) => {
    console.log("title component", spec);
    const Markdown = getComponent({name: "markdown"});
    return (
      <View style={styles.container}>
        <Markdown style={styles.name}>{spec.info.name}</Markdown>
        <Markdown style={styles.summary}>This is my awesome custom component!</Markdown>
      </View>
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
    components: { title }
  },
};