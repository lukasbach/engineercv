import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { educationSectionComponent } from "./sections/education-section-component.js";
import { workSectionComponent } from "./sections/work-section-component.js";
import { projectsSectionComponent } from "./sections/projects-section-component.js";
import { skillsSectionComponent } from "./sections/skill-section-component.js";
import { basicsSectionComponent } from "./sections/basics-section-component.js";
import { volunteerSectionComponent } from "./sections/volunteer-section-component.js";
import { awardsSectionComponent } from "./sections/awards-section-component.js";
import { certificatesSectionComponent } from "./sections/certificates-section-component.js";
import { publicationsSectionComponent } from "./sections/publications-section-component.js";
import { languagesSectionComponent } from "./sections/languages-section-component.js";
import { interestsSectionComponent } from "./sections/interests-section-component.js";
import { referencesSectionComponent } from "./sections/references-section-component.js";

const defaultOrder = [
  basicsSectionComponent.name,
  skillsSectionComponent.name,
  workSectionComponent.name,
  volunteerSectionComponent.name,
  projectsSectionComponent.name,
  educationSectionComponent.name,
  awardsSectionComponent.name,
  certificatesSectionComponent.name,
  publicationsSectionComponent.name,
  languagesSectionComponent.name,
  interestsSectionComponent.name,
  referencesSectionComponent.name,
] as const;

export const sectionOrderComponent = defineComponent({
  name: "sectionOrder" as const,
  schema: z.object({
    order: z.array(z.enum(defaultOrder).or(z.string())).optional(),
  }),
  additionalProps: z.object({ children: z.any() }),
  component: ({ spec, getComponent }) => {
    return (
      <>
        {(spec.order ?? defaultOrder).map((name) => {
          const Comp = getComponent({ name });
          return Comp ? <Comp key={name} /> : null;
        })}
      </>
    );
  },
  defaultStyles: {},
});
