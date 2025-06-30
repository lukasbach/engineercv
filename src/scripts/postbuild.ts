import { zodToJsonSchema } from "zod-to-json-schema";
import * as fs from "fs";
import { buildComponentRegistry } from "../components/default-components.js";

await fs.promises.mkdir("lib", { recursive: true });

await fs.promises.writeFile(
  "lib/schema.json",
  JSON.stringify(
    zodToJsonSchema(buildComponentRegistry().specSchema, {
      $refStrategy: "none",
      removeAdditionalStrategy: "strict",
    }),
    null,
    2,
  ),
  "utf-8",
);
