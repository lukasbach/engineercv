import z from "zod";

export const baseSpecSchema = z.object({
  imports: z.string().array().optional(),
  output: z.string(),
  config: z
    .object({
      fonts: z
        .array(
          z.object({
            family: z.string(),
            src: z.string(),
            fontStyle: z.string().optional(),
            fontWeight: z.string().optional(),
          }),
        )
        .optional(),
      customComponents: z.record(z.string(), z.any()).optional(),
    })
    .default({}),
});
