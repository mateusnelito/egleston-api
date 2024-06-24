import { z } from 'zod';

const defaultBadRequestSkeleton = z.object({
  statusCode: z.number().default(400),
  message: z.string(),
});

export const simpleBadRequestSchema = defaultBadRequestSkeleton.extend({
  errors: z.record(z.string(), z.array(z.string())),
});

// FIXME: Serialize the appropriate schema
export const complexBadRequestSchema = simpleBadRequestSchema.or(
  defaultBadRequestSkeleton.extend({
    errors: z.record(z.any()),
  })
);

export const notFoundRequestSchema = defaultBadRequestSkeleton.or(
  defaultBadRequestSkeleton.extend({
    errors: z.record(z.string(), z.string()),
  })
);

export const getAllResourcesParamsSchema = z.object({
  page_size: z.coerce
    .number({
      invalid_type_error: 'O tamanho da página deve ser número.',
    })
    .int({ message: 'O tamanho da página deve ser inteiro.' })
    .positive({ message: 'O tamanho da página deve ser positivo.' })
    .default(10),
  cursor: z.coerce
    .number({
      invalid_type_error: 'O cursor deve ser número.',
    })
    .int({ message: 'O cursor deve ser inteiro.' })
    .positive({ message: 'O cursor deve ser positivo.' })
    .min(2, { message: 'O valor do cursor dever ser no minimo 2.' })
    .nullish(),
});

export type simpleBadRequestResponseType = z.infer<
  typeof simpleBadRequestSchema
>;

export type complexBadRequestResponseType = z.infer<
  typeof complexBadRequestSchema
>;

export type notFoundRequestResponseType = z.infer<typeof notFoundRequestSchema>;
