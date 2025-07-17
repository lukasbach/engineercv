import { z } from "zod";
import { Style } from "@react-pdf/stylesheet";
import { FC } from "react";

type ComponentGetter = <P = any>(
  componentDefinition:
    | ComponentDefinition<string, any, P, any>
    | { name: string },
) => FC<P>;

export type ComponentDefinition<N extends string, T, P, S extends Style> = {
  name: N;
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
  defaultStyles: S;
};

export const defineComponent = <N extends string, T, P, S extends Style>(
  definition: ComponentDefinition<N, T, P, S>,
): ComponentDefinition<N, T, P, S> => definition;
