import React, { FC } from "react";
import { StyleSheet, render } from "@react-pdf/renderer";
import { merge } from "ts-deepmerge";
import { buildComponentRegistry } from "../../components/default-components.js";
import { DocumentGlobalsProvider } from "../../components/document-globals.js";

export const generatePdf = async (config: any): Promise<void> => {
  const components = buildComponentRegistry();
  const spec = components.parseSpec(config);

  const getComponent = ({ name }: { name: string }) => {
    const { component: Comp, defaultStyles } = components.getComponent(name);
    const styles = merge(defaultStyles, spec.styles?.[name] || {});
    const stylesheet = StyleSheet.create(styles);
    return (props: any) => (
      <Comp
        {...props}
        styles={stylesheet}
        spec={spec}
        getComponent={getComponent}
      />
    );
  };

  const ComponentRenderer: FC<{ name: string } & any> = ({
    name,
    ...props
  }) => {
    const Comp = getComponent({ name });
    return <Comp {...props} />;
  };

  const document = (
    <DocumentGlobalsProvider value={{ styles: spec.styles ?? {}, spec }}>
      <ComponentRenderer name="document">
        <ComponentRenderer name="page">
          <ComponentRenderer name="title" />
          <ComponentRenderer name="experience" />
        </ComponentRenderer>
      </ComponentRenderer>
    </DocumentGlobalsProvider>
  );

  await render(document, "output.pdf");
};
