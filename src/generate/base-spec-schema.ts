import z from "zod";

export const baseSpecSchema = z.object({
  imports: z.string().array().nullish(),
  output: z.string(),
  skip: z.boolean().nullish(),
  isTemplate: z.boolean().nullish(),
  date: z.string().nullish(),
  config: z
    .object({
      fonts: z
        .array(
          z.object({
            family: z.string(),
            src: z.string(),
            fontStyle: z.string().nullish(),
            fontWeight: z.string().nullish(),
          }),
        )
        .nullish(),
      customComponents: z.record(z.string(), z.any()).nullish(),
    })
    .default({}),
});
