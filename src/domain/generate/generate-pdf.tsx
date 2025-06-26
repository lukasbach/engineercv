import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, render } from "@react-pdf/renderer";
import * as yaml from "yaml";
import { merge } from "ts-deepmerge";
import { buildComponentRegistry } from "../../components/default-components.js";

export const generatePdf = async (config: string): Promise<void> => {
  const components = buildComponentRegistry();
  const spec = yaml.parse(config);

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
    <ComponentRenderer component="document">
      <ComponentRenderer component="page">
        <ComponentRenderer component="title" />
      </ComponentRenderer>
    </ComponentRenderer>
  );

  await render(document, "output.pdf");
};
