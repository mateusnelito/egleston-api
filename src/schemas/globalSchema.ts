import { z } from 'zod';

export const simpleBadRequestSchema = z.object({
  statusCode: z.number().default(400),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())),
});

export const complexBadRequestSchema = simpleBadRequestSchema.or(
  z.object({
    statusCode: z.number().default(400),
    message: z.string(),
    errors: z.record(
      z.string(),
      z.record(z.string(), z.record(z.string(), z.string().array()))
    ),
  })
);

export const notFoundRequestSchema = z
  .object({
    statusCode: z.number().default(404),
    message: z.string(),
  })
  .or(
    z.object({
      statusCode: z.number().default(404),
      message: z.string(),
      errors: z.record(z.string(), z.string()),
    })
  );

export type simpleBadRequestResponseType = z.infer<
  typeof simpleBadRequestSchema
>;

export type complexBadRequestResponseType = z.infer<
  typeof complexBadRequestSchema
>;

export type notFoundRequestResponseType = z.infer<typeof notFoundRequestSchema>;
