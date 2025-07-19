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

const defaultIcons = {
  mail: {
    suite: "md",
    icon: "MdOutlineEmail",
  },
  phone: {
    suite: "bs",
    icon: "BsTelephone",
  },
  url: {
    suite: "sl",
    icon: "SlGlobe",
  },
  location: {
    suite: "md",
    icon: "MdOutlinePersonPinCircle",
  },
  github: {
    suite: "fa",
    icon: "FaGithub",
  },
  linkedin: {
    suite: "ai",
    icon: "AiOutlineLinkedin",
  },
};

export const basicsItemsComponent = defineComponent({
  name: "basicsItems" as const,
  additionalProps: z.object({
    renderItem: z
      .function()
      .args(z.any(), z.any(), z.number())
      .returns(z.any()),
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
        ? [
            {
              text: `[${spec.basics.email}](mailto:${spec.basics.email})`,
              icon: "mail",
            },
          ]
        : [],
      phone: spec.basics.phone
        ? [
            {
              text: `[${spec.basics.phone}](tel:${spec.basics.phone.replaceAll(/[^\d]/g, "")})`,
              icon: "phone",
            },
          ]
        : [],
      url: spec.basics.url
        ? [{ text: <Url url={spec.basics.url} />, icon: "url" }]
        : [],
      profiles:
        spec.basics.profiles?.map((profile) => ({
          text: <Url url={profile.url} />,
          icon: profile.network,
        })) ?? [],
      location: location ? [{ text: location, icon: "location" }] : [],
      highlights: spec.basics.highlights?.map((text) => ({ text })) ?? [],
    };

    const iconMap = {
      ...defaultIcons,
      ...(spec.basics.icons ?? {}),
    };

    const orderedItems = (spec.basics.order ?? defaultOrder)
      .map((key) => (key in items ? items[key as keyof typeof items] : []))
      .flat();

    return orderedItems
      .filter(Boolean)
      .map(({ text, icon }: any, index) =>
        renderItem(text, (iconMap as any)[icon?.toLowerCase()], index),
      );
  },
  defaultStyles: {} as const,
});
