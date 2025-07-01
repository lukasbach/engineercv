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
import { baseSpecSchema } from "../domain/generate/base-spec-schema.js";

export const defaultComponents = Object.fromEntries(
  [
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
  ].map((c) => [c.name, c] as const),
);

export const buildComponentRegistry = (
  customComponents: Record<string, ComponentDefinition<any, any, any>> = {},
) => {
  const components = Object.values({
    ...defaultComponents,
    ...customComponents,
  });
  return {
    all: components,
    getComponent: (name: string) => {
      const component = components.find((c) => c.name === name);
      if (!component) {
        throw new Error(`Component ${name} not found`);
      }
      return component;
    },
    verifySpec: (spec: unknown) => {
      baseSpecSchema.parse(spec);
      for (const component of components) {
        component.schema?.parse(spec);
      }
    },
  };
};

export type ComponentRegistry = ReturnType<typeof buildComponentRegistry>;
