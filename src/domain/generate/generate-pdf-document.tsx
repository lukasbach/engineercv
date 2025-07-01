import React, { FC } from "react";
import { StyleSheet } from "@react-pdf/renderer";
import { merge } from "ts-deepmerge";
import path from "path";
import { buildComponentRegistry } from "../../components/default-components.js";
import { baseSpecSchema } from "./base-spec-schema.js";

export const generatePdfDocument = async (spec: any, file: string) => {
  const components = buildComponentRegistry(spec.config?.components || {});
  components.verifySpec(spec);

  const getComponent = ({ name }: { name: string }) => {
    const { component: Comp, defaultStyles } = components.getComponent(name);
    const styles = merge(defaultStyles, spec.styles?.[name] || {});
    const stylesheet = StyleSheet.create(styles);
    const resolvePath = (filePath: string) =>
      path.isAbsolute(filePath)
        ? filePath
        : path.resolve(path.join(path.dirname(file), filePath));
    return (props: any) => (
      <Comp
        {...props}
        styles={stylesheet}
        spec={spec}
        resolvePath={resolvePath}
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
