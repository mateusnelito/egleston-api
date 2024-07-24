import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';
import { time } from 'console';
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

export const postTurnoSchema = {
  summary: 'Adiciona um novo turno',
  tags: ['turnos'],
  body: turnoBodySchema.omit({ id: true }),
  response: {
    201: turnoBodySchema,
    400: simpleBadRequestSchema.or(
      z.object({
        statusCode: z.number().default(400),
        message: z.string(),
      })
    ),
  },
};

export type postTurnoBodyType = z.infer<typeof postTurnoSchema.body>;
