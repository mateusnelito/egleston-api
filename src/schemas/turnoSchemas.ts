import { z } from 'zod';
import {
  complexBadRequestSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const turnoBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do turno é obrigatório.',
      invalid_type_error: 'O id do turno deve ser número.',
    })
    .int({ message: 'O id do turno deve ser inteiro.' })
    .positive({ message: 'O id do turno deve ser positivo.' }),
  nome: z
    .string({
      required_error: 'O nome do turno é obrigatório.',
      invalid_type_error: 'O nome do turno deve ser string.',
    })
    .trim()
    .min(1, {
      message: 'O nome do turno deve possuir no mínimo 1 caracteres.',
    })
    .max(30, {
      message: 'O nome do turno deve possuir no máximo 30 caracteres.',
    }),
  // TODO: Add appropriated regex
  inicio: z
    .string({
      required_error: 'O inicio é obrigatório.',
      invalid_type_error: 'O inicio deve ser string.',
    })
    .time({ precision: 0, message: 'O inicio deve ser válido (HH:mm:ss)' }),
  termino: z
    .string({
      required_error: 'O termino é obrigatório.',
      invalid_type_error: 'O termino deve ser string.',
    })
    .time({ precision: 0, message: 'O termino deve ser válido (HH:mm:ss)' }),
});

const turnoParamsSchema = z.object({
  turnoId: z.coerce
    .number({
      required_error: 'O id do turno é obrigatório.',
      invalid_type_error: 'O id do turno deve ser número.',
    })
    .int({ message: 'O id do turno deve ser inteiro.' })
    .positive({ message: 'O id do turno deve ser positivo.' }),
});

export const createTurnoSchema = {
  summary: 'Adiciona um novo turno',
  tags: ['turnos'],
  body: turnoBodySchema.omit({ id: true }),
  response: {
    201: turnoBodySchema,
    400: simpleBadRequestSchema,
  },
};

export const updateTurnoSchema = {
  summary: 'Atualiza um turno existente',
  tags: ['turnos'],
  params: turnoParamsSchema,
  body: turnoBodySchema.omit({ id: true }),
  response: {
    200: turnoBodySchema,
    404: notFoundRequestSchema,
    400: simpleBadRequestSchema,
  },
};

export const getTurnoSchema = {
  summary: 'Retorna um turno',
  tags: ['turnos'],
  params: turnoParamsSchema,
  response: {
    200: turnoBodySchema,
    404: notFoundRequestSchema,
  },
};

export const getTurnosSchema = {
  summary: 'Retorna todos os turnos',
  tags: ['turnos'],
  response: {
    200: z.object({
      data: z.array(turnoBodySchema.omit({ inicio: true, termino: true })),
    }),
  },
};

export const createMultiplesClassesInTurnoSchema = {
  tags: ['turnos'],
  summary: 'Associa um turno à várias classes.',
  params: turnoParamsSchema,
  body: z.object({
    classes: z
      .array(
        z
          .number({
            message: 'O array de classes deve conter apenas números.',
          })
          .int({
            message: 'O array de classes deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de classes deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'Os classes devem ser  enviadas no formato de array.',
        }
      )
      .nonempty({ message: 'O array de classes não deve estar vazio.' }),
  }),
  response: {
    400: complexBadRequestSchema,
    404: complexBadRequestSchema.or(notFoundRequestSchema),
  },
};

export type turnoBodyType = z.infer<typeof createTurnoSchema.body>;
export type turnoParamsType = z.infer<typeof turnoParamsSchema>;
export type createMultiplesClassesInTurnoBodyType = z.infer<
  typeof createMultiplesClassesInTurnoSchema.body
>;
