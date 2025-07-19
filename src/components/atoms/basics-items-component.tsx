import React from "react";
import z from "zod";
import Handlebars from "handlebars";
import { defineComponent } from "../define-component.js";
import { urlComponent } from "./url.js";
import { basicsSectionComponent } from "../sections/basics-section-component.js";

const defaultOrder = [
  "email",
  "phone",
  "url",
  "profiles",
  "location",
  "highlights",
];

export const basicsItemsComponent = defineComponent({
  name: "basicsItems" as const,
  additionalProps: z.object({
    renderItem: z.function().args(z.any(), z.number()).returns(z.any()),
  }),
  schema: basicsSectionComponent.schema,
  component: ({ spec, getComponent, renderItem }) => {
    const Url = getComponent(urlComponent);
    const location = spec.basics.location
      ? Handlebars.create().compile(spec.basics.locationFormat ?? "{{city}}")(
          spec.basics.location,
        )
      : null;

    const items = {
      email: spec.basics.email
        ? [`[${spec.basics.email}](mailto:${spec.basics.email})`]
        : [],
      phone: spec.basics.phone
        ? [
            `[${spec.basics.phone}](tel:${spec.basics.phone.replaceAll(/[^\d]/g, "")})`,
          ]
        : [],
      url: spec.basics.url ? [<Url url={spec.basics.url} />] : [],
      profiles:
        spec.basics.profiles?.map((profile) => (
          <Url key={profile.network} url={profile.url} />
        )) ?? [],
      location: location ? [location] : [],
      highlights: spec.basics.highlights ?? [],
    };

    const orderedItems = (spec.basics.order ?? defaultOrder)
      .map((key) => (key in items ? items[key as keyof typeof items] : []))
      .flat();

    return orderedItems.filter(Boolean).map(renderItem);
  },
  defaultStyles: {} as const,
});
