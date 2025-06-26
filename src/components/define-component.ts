import { PropsWithChildren } from "react";
import { z } from "zod";
import { Styles } from "@react-pdf/stylesheet";

export type ComponentDefinition<T, S extends Styles> = {
  name: string;
  overwrites?: string;
  schema: z.ZodType<T>;
  component: React.ComponentType<PropsWithChildren<{ spec: T; styles: S }>>;
  defaultStyles?: S;
};

export const defineComponent = <T, S extends Styles>(
  definition: ComponentDefinition<T, S>,
): ComponentDefinition<T, S> => definition;
