import { zodToJsonSchema } from "zod-to-json-schema";
import * as fs from "fs";
import { z } from "zod";
import { defaultComponents } from "../components/default-components.js";
import { baseSpecSchema } from "../generate/base-spec-schema.js";

// Function to recursively remove all "required" fields from a JSON schema
function removeRequiredFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeRequiredFields);
  }
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== "required") {
        result[key] = removeRequiredFields(value);
      }
    }
    return result;
  }
  return obj;
}

await fs.promises.mkdir("lib", { recursive: true });

const stylesSchema = z.object({
  styles: z
    .record(
      z.enum(Object.values(defaultComponents).map((c) => c.name) as [string]),
      z.any(),
    )
    .nullish(),
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
      .nullish(),
  }),
);

const generatedSchema = zodToJsonSchema(specSchemaWithVariants, {
  $refStrategy: "none",
  removeAdditionalStrategy: "strict",
});

const schemaWithoutRequired = removeRequiredFields(generatedSchema);

await fs.promises.writeFile(
  "lib/schema.json",
  JSON.stringify(schemaWithoutRequired, null, 2),
  "utf-8",
);
