import z from "zod";
import { ComponentDefinition } from "./define-component.js";
import { listItemComponent } from "./list-item-component.js";
import { detailsItemComponent } from "./details-item-component.js";
import { dateRangeComponent } from "./date-range-component.js";
import { sectionHeaderComponent } from "./section-header-component.js";
import { experienceSectionComponent } from "./experience-section-component.js";
import { projectsSectionComponent } from "./project-section-component.js";
import { educationSectionComponent } from "./education-section-component.js";
import { skillsSectionComponent } from "./skill-section-component.js";
import { markdownComponent } from "./markdown-component.js";
import { documentComponent } from "./document-component.js";
import { pageComponent } from "./page-component.js";
import { titleSectionComponent } from "./title-section-component.js";

export const defaultComponents = [
  markdownComponent,
  documentComponent,
  pageComponent,
  titleSectionComponent,
  sectionHeaderComponent,
  listItemComponent,
  detailsItemComponent,
  experienceSectionComponent,
  dateRangeComponent,
  projectsSectionComponent,
  educationSectionComponent,
  skillsSectionComponent,
];

export const baseSpecSchema = z.object({
  imports: z.string().array().optional(),
  output: z.string(),
  config: z
    .object({
      fonts: z
        .array(
          z.object({
            family: z.string(),
            src: z.string(),
            fontStyle: z.string().optional(),
            fontWeight: z.string().optional(),
          }),
        )
        .optional(),
    })
    .default({}),
});

export const buildComponentRegistry = (
  components: ComponentDefinition<any, any, any>[] = defaultComponents,
) => {
  const stylesSchema = z.object({
    styles: z
      .record(z.enum(components.map((c) => c.name) as [string]), z.any())
      .optional(),
  });
  const specSchema = components.reduce(
    (prev, { schema }) => z.intersection(prev, schema),
    z.intersection(baseSpecSchema, stylesSchema) as z.ZodType<any>,
  );
  const specSchemaWithVariants = z.intersection(
    specSchema,
    z.object({
      variants: z
        .record(z.string(), z.any().array()) // zodDeepPartial(specSchema).array()
        .optional(),
    }),
  );
  return {
    all: components,
    getComponent: (name: string) => {
      const component = components.find((c) => c.name === name);
      if (!component) {
        throw new Error(`Component ${name} not found`);
      }
      return component;
    },
    specSchema: specSchemaWithVariants,
  };
};

export type ComponentRegistry = ReturnType<typeof buildComponentRegistry>;
