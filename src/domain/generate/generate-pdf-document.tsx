import React, { FC } from "react";
import { StyleSheet } from "@react-pdf/renderer";
import { merge } from "ts-deepmerge";
import {
  baseSpecSchema,
  buildComponentRegistry,
} from "../../components/default-components.js";

export const generatePdfDocument = async (spec: any) => {
  const components = buildComponentRegistry(spec.config?.xxx || {});
  components.specSchema.parse(spec);

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
    <ComponentRenderer name="document">
      <ComponentRenderer name="page">
        <ComponentRenderer name="title" />
        <ComponentRenderer name="skills" />
        <ComponentRenderer name="experience" />
        <ComponentRenderer name="projects" />
        <ComponentRenderer name="education" />
      </ComponentRenderer>
    </ComponentRenderer>
  );

  const fonts = baseSpecSchema.parse(spec).config?.fonts ?? [];

  return { document, fonts };
};
