import { z } from "zod";
import { Style } from "@react-pdf/stylesheet";
import { FC } from "react";

type ComponentGetter = <P = any>(
  componentDefinition: ComponentDefinition<any, P, any> | { name: string },
) => FC<P>;

export type ComponentDefinition<T, P, S extends Style> = {
  name: string;
  overwrites?: string;
  schema: z.ZodType<T>;
  additionalProps?: z.ZodType<P>;
  component: React.ComponentType<
    {
      spec: T;
      styles: S;
      globalStyles: any;
      getComponent: ComponentGetter;
      resolvePath: (path: string) => string;
    } & P
  >;
  defaultStyles?: S;
};

export const defineComponent = <T, P, S extends Style>(
  definition: ComponentDefinition<T, P, S>,
): ComponentDefinition<T, P, S> => definition;
