import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, render } from "@react-pdf/renderer";
import { merge } from "ts-deepmerge";
import { buildComponentRegistry } from "../../components/default-components.js";
import { DocumentGlobalsProvider } from "../../components/document-globals.js";

export const generatePdf = async (config: any): Promise<void> => {
  const components = buildComponentRegistry();
  const spec = components.parseSpec(config);

  const ComponentRenderer: FC<PropsWithChildren<{ component: string }>> = ({
    component,
    children,
  }) => {
    const { component: Comp, defaultStyles } =
      components.getComponent(component);
    const styles = merge(defaultStyles, spec.styles?.[component] || {});
    const stylesheet = StyleSheet.create(styles);
    return (
      <Comp styles={stylesheet} spec={spec}>
        {children}
      </Comp>
    );
  };

  const document = (
    <DocumentGlobalsProvider value={{ styles: spec.styles ?? {}, spec }}>
      <ComponentRenderer component="document">
        <ComponentRenderer component="page">
          <ComponentRenderer component="title" />
        </ComponentRenderer>
      </ComponentRenderer>
    </DocumentGlobalsProvider>
  );

  await render(document, "output.pdf");
};
