import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { educationSectionComponent } from "./education-section-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { projectsSectionComponent } from "./project-section-component.js";
import { skillsSectionComponent } from "./skill-section-component.js";
import { titleSectionComponent } from "./title-section-component.js";
import { volunteerSectionComponent } from "./volunteer-section-component.js";
import { awardsSectionComponent } from "./awards-section-component.js";
import { certificatesSectionComponent } from "./certificates-section-component.js";
import { publicationsSectionComponent } from "./publications-section-component.js";
import { languagesSectionComponent } from "./languages-section-component.js";
import { interestsSectionComponent } from "./interests-section-component.js";
import { referencesSectionComponent } from "./references-section-component.js";

const defaultOrder = [
  titleSectionComponent.name,
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
