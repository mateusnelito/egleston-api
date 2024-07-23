import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';
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
  // .regex(//, {
  //   message: 'o nome do turno deve seguir o padrão 9999-9999.',
  // }),
  // FIXME: Remove if isn't work
  inicio: z.date(),
  termino: z.date(),
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

export const postTurnoSchema = {
  summary: 'Adiciona um novo turno',
  tags: ['turnos'],
  body: turnoBodySchema.omit({ id: true }),
  response: {
    201: turnoBodySchema,
    400: simpleBadRequestSchema,
  },
};

export type postTurnoBodyType = z.infer<typeof postTurnoSchema.body>;
