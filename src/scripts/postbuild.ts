import { zodToJsonSchema } from "zod-to-json-schema";
import * as fs from "fs";
import { z } from "zod";
import { defaultComponents } from "../components/default-components.js";
import { baseSpecSchema } from "../domain/generate/base-spec-schema.js";

await fs.promises.mkdir("lib", { recursive: true });

const stylesSchema = z.object({
  styles: z
    .record(
      z.enum(Object.values(defaultComponents).map((c) => c.name) as [string]),
      z.any(),
    )
    .optional(),
});
const specSchema = Object.values(defaultComponents).reduce(
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

await fs.promises.writeFile(
  "lib/schema.json",
  JSON.stringify(
    zodToJsonSchema(specSchemaWithVariants, {
      $refStrategy: "none",
      removeAdditionalStrategy: "strict",
    }),
    null,
    2,
  ),
  "utf-8",
);
