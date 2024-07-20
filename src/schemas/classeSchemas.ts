import { z } from 'zod';
import { notFoundRequestSchema, simpleBadRequestSchema } from './globalSchema';
const classeBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id da classe é obrigatório.',
      invalid_type_error: 'O id da classe deve ser número.',
    })
    .int({ message: 'O id da classe deve ser inteiro.' })
    .positive({ message: 'O id da classe deve ser positivo.' }),
  nome: z.enum(['10ª', '11ª', '12ª', '13ª'], {
    message: 'São permitidas apenas classes do ensino médio (10ª-13ª).',
  }),
  anoLectivoId: z
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
  cursoId: z
    .number({
      required_error: 'O id de curso é obrigatório.',
      invalid_type_error: 'O id de curso deve ser número.',
    })
    .int({ message: 'O id de curso deve ser inteiro.' })
    .positive({ message: 'O id de curso deve ser positivo.' }),
});

const classeParamsSchema = z.object({
  classeId: z.coerce
    .number({
      required_error: 'O id da classe é obrigatório.',
      invalid_type_error: 'O id da classe deve ser número.',
    })
    .int({ message: 'O id da classe deve ser inteiro.' })
    .positive({ message: 'O id da classe deve ser positivo.' }),
});

export const postClasseSchema = {
  summary: 'Adiciona uma nova classe',
  tags: ['classes'],
  body: classeBodySchema.omit({ id: true }),
  response: {
    201: classeBodySchema,
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const putClasseSchema = {
  summary: 'Atualiza uma classe existente',
  tags: ['classes'],
  params: classeParamsSchema,
  body: classeBodySchema.omit({ id: true }),
  response: {
    200: classeBodySchema.omit({ id: true }),
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getClassesSchema = {
  summary: 'Retorna todas as classes com base no ano lectivo',
  tags: ['classes'],
  response: {
    200: z.object({
      data: z.array(
        classeBodySchema.omit({ anoLectivoId: true, cursoId: true })
      ),
    }),
  },
};

export const getClasseSchema = {
  summary: 'Retorna uma classe',
  tags: ['classes'],
  params: classeParamsSchema,
  response: {
    200: classeBodySchema,
    404: notFoundRequestSchema,
  },
};

export type postClasseBodyType = z.infer<typeof postClasseSchema.body>;
export type classeParamsType = z.infer<typeof classeParamsSchema>;
