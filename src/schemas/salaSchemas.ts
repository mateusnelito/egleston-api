import { z } from 'zod';
const salaBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id da sala é obrigatório.',
      invalid_type_error: 'O id da sala deve ser número.',
    })
    .int({ message: 'O id da sala deve ser inteiro.' })
    .positive({ message: 'O id da sala deve ser positivo.' }),
  nome: z
    .string({
      required_error: 'O nome da sala é obrigatório.',
      invalid_type_error: 'O nome da sala deve ser string.',
    })
    .trim()
    .min(1, {
      message: 'O nome da sala deve possuir no mínimo 1 caracteres.',
    })
    .max(30, {
      message: 'O nome da sala deve possuir no máximo 30 caracteres.',
    }),
  // TODO: Add appropriated regex
  // .regex(//, {
  //   message: 'o nome da sala deve seguir o padrão 9999-9999.',
  // }),
  capacidade: z
    .number({
      required_error: 'A capacidade é obrigatória.',
      invalid_type_error: 'A capacidade deve ser número.',
    })
    .int({ message: 'A capacidade deve ser inteiro.' })
    .min(10, { message: 'A capacidade minima é 10.' })
    .max(70, { message: 'A capacidade maxima é 70' }),
  localizacao: z
    .string({
      required_error: 'A localização é obrigatório.',
      invalid_type_error: 'A localização deve ser string.',
    })
    .trim()
    .min(10, {
      message: 'A localização deve possuir no mínimo 10 caracteres.',
    })
    .max(30, {
      message: 'A localização deve possuir no máximo 255 caracteres.',
    }),
  // TODO: Add appropriated regex
  // .regex(//, {
  //   message: 'o nome da sala deve seguir o padrão 9999-9999.',
  // }),
});

const salaParamsSchema = z.object({
  salaId: z.coerce
    .number({
      required_error: 'O id da sala é obrigatório.',
      invalid_type_error: 'O id da sala deve ser número.',
    })
    .int({ message: 'O id da sala deve ser inteiro.' })
    .positive({ message: 'O id da sala deve ser positivo.' }),
});
