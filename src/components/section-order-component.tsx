import React from "react";
import z from "zod";
import { defineComponent } from "./define-component.js";
import { educationSectionComponent } from "./education-section-component.js";
import { workSectionComponent } from "./work-section-component.js";
import { projectsSectionComponent } from "./project-section-component.js";
import { skillsSectionComponent } from "./skill-section-component.js";
import { titleSectionComponent } from "./title-section-component.js";

const defaultOrder = [
  titleSectionComponent.name,
  skillsSectionComponent.name,
  workSectionComponent.name,
  projectsSectionComponent.name,
  educationSectionComponent.name,
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
