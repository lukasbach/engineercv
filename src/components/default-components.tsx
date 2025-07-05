import { ComponentDefinition } from "./define-component.js";
import { listItemComponent } from "./atoms/list-item-component.js";
import { detailsItemComponent } from "./atoms/details-item-component.js";
import { dateRangeComponent } from "./atoms/date-range-component.js";
import { sectionHeaderComponent } from "./atoms/section-header-component.js";
import { workSectionComponent } from "./sections/work-section-component.js";
import { projectsSectionComponent } from "./sections/projects-section-component.js";
import { educationSectionComponent } from "./sections/education-section-component.js";
import { skillsSectionComponent } from "./sections/skill-section-component.js";
import { volunteerSectionComponent } from "./sections/volunteer-section-component.js";
import { awardsSectionComponent } from "./sections/awards-section-component.js";
import { certificatesSectionComponent } from "./sections/certificates-section-component.js";
import { publicationsSectionComponent } from "./sections/publications-section-component.js";
import { languagesSectionComponent } from "./sections/languages-section-component.js";
import { interestsSectionComponent } from "./sections/interests-section-component.js";
import { referencesSectionComponent } from "./sections/references-section-component.js";
import { markdownComponent } from "./atoms/markdown-component.js";
import { documentComponent } from "./document-component.js";
import { pageComponent } from "./page-component.js";
import { titleSectionComponent } from "./sections/title-section-component.js";
import { baseSpecSchema } from "../domain/generate/base-spec-schema.js";
import { sectionOrderComponent } from "./section-order-component.js";

export const defaultComponents = {
  [markdownComponent.name]: markdownComponent,
  [documentComponent.name]: documentComponent,
  [pageComponent.name]: pageComponent,
  [titleSectionComponent.name]: titleSectionComponent,
  [sectionHeaderComponent.name]: sectionHeaderComponent,
  [listItemComponent.name]: listItemComponent,
  [detailsItemComponent.name]: detailsItemComponent,
  [workSectionComponent.name]: workSectionComponent,
  [dateRangeComponent.name]: dateRangeComponent,
  [projectsSectionComponent.name]: projectsSectionComponent,
  [educationSectionComponent.name]: educationSectionComponent,
  [skillsSectionComponent.name]: skillsSectionComponent,
  [volunteerSectionComponent.name]: volunteerSectionComponent,
  [awardsSectionComponent.name]: awardsSectionComponent,
  [certificatesSectionComponent.name]: certificatesSectionComponent,
  [publicationsSectionComponent.name]: publicationsSectionComponent,
  [languagesSectionComponent.name]: languagesSectionComponent,
  [interestsSectionComponent.name]: interestsSectionComponent,
  [referencesSectionComponent.name]: referencesSectionComponent,
  [sectionOrderComponent.name]: sectionOrderComponent,
} as const;

export const buildComponentRegistry = (
  customComponents: Record<
    string,
    ComponentDefinition<any, any, any, any>
  > = {},
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
