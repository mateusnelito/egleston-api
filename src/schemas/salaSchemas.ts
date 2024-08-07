import { z } from 'zod';
import { notFoundRequestSchema, simpleBadRequestSchema } from './globalSchema';
import { turmaBodySchema } from './turmaSchemas';
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
    .max(255, {
      message: 'A localização deve possuir no máximo 255 caracteres.',
    }),
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

export const createSalaSchema = {
  summary: 'Adiciona uma nova sala',
  tags: ['salas'],
  body: salaBodySchema.omit({ id: true }),
  response: {
    201: salaBodySchema,
    400: simpleBadRequestSchema,
  },
};

export const updateSalaSchema = {
  summary: 'Atualiza uma sala existente',
  tags: ['salas'],
  params: salaParamsSchema,
  body: salaBodySchema.omit({ id: true }),
  response: {
    200: salaBodySchema,
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getSalaSchema = {
  summary: 'Retorna uma sala',
  tags: ['salas'],
  params: salaParamsSchema,
  response: {
    200: salaBodySchema,
    404: notFoundRequestSchema,
  },
};

export const getSalasSchema = {
  summary: 'Retorna todas as salas',
  tags: ['salas'],
  response: {
    200: z.object({
      data: z.array(
        salaBodySchema.omit({ capacidade: true, localizacao: true })
      ),
    }),
  },
};

export const getSalaTurmasSchema = {
  summary: 'Retorna todas as turmas de uma sala',
  tags: ['salas'],
  params: salaParamsSchema,
  response: {
    200: z.object({
      data: z.array(turmaBodySchema.omit({ salaId: true, classeId: true })),
    }),
    404: notFoundRequestSchema,
  },
};

export const createTurmaToSalaSchema = {
  summary: 'Adiciona uma turma a uma sala',
  tags: ['salas'],
  params: salaParamsSchema,
  body: turmaBodySchema.omit({ id: true, salaId: true }),
  response: {
    // TODO: SEND A BETTER RESPONSE BODY
    201: turmaBodySchema,
    404: notFoundRequestSchema,
  },
};

export type createSalaBodyType = z.infer<typeof createSalaSchema.body>;
export type salaParamsType = z.infer<typeof salaParamsSchema>;
export type createTurmaToSalaBodyType = z.infer<
  typeof createTurmaToSalaSchema.body
>;
