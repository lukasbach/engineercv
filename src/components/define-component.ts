import { PropsWithChildren } from "react";
import { z } from "zod";
import { Style } from "@react-pdf/stylesheet";

export type ComponentDefinition<T, S extends Style> = {
  name: string;
  overwrites?: string;
  schema: z.ZodType<T>;
  component: React.ComponentType<PropsWithChildren<{ spec: T; styles: S }>>;
  defaultStyles?: S;
};

export const defineComponent = <T, S extends Style>(
  definition: ComponentDefinition<T, S>,
): ComponentDefinition<T, S> => definition;
