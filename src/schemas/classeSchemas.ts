import { z } from 'zod';
import {
  complexBadRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';
import { turmaBodySchema } from './turmaSchemas';

export const classeBodySchema = z.object({
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
  cursoId: z
    .number({
      required_error: 'O id de curso é obrigatório.',
      invalid_type_error: 'O id de curso deve ser número.',
    })
    .int({ message: 'O id de curso deve ser inteiro.' })
    .positive({ message: 'O id de curso deve ser positivo.' }),
  valorMatricula: z
    .number({
      required_error: 'O valor da matrícula é obrigatório.',
      invalid_type_error: 'O valor da matrícula deve ser número.',
    })
    .positive({ message: 'O valor da matrícula deve ser positivo.' }),
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

export const createClasseSchema = {
  summary: 'Adiciona uma nova classe',
  tags: ['classes'],
  body: classeBodySchema.omit({ id: true }),
  response: {
    201: classeBodySchema.extend({
      valorMatricula: z.coerce.number(),
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const updateClasseSchema = {
  summary: 'Atualiza uma classe existente',
  tags: ['classes'],
  params: classeParamsSchema,
  body: classeBodySchema.omit({ id: true }),
  response: {
    200: classeBodySchema.omit({ id: true }).extend({
      valorMatricula: z.coerce.number(),
    }),
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getClasseSchema = {
  summary: 'Retorna uma classe',
  tags: ['classes'],
  params: classeParamsSchema,
  response: {
    // 200: classeBodySchema
    //   .omit({  cursoId: true })
    //   .extend({ anoLectivo: z.string(), curso: z.string() }),
    404: simpleBadRequestSchema,
  },
};

export const getClasseTurmasSchema = {
  summary: 'Retorna todas as turmas de uma classe',
  tags: ['classes'],
  params: classeParamsSchema,
  response: {
    200: z.object({
      data: z.array(
        turmaBodySchema.omit({ salaId: true, classeId: true, turnoId: true })
      ),
    }),
    404: simpleBadRequestSchema,
  },
};

export const createTurmaToClasseSchema = {
  summary: 'Adiciona uma turma a classe',
  tags: ['classes'],
  params: classeParamsSchema,
  body: turmaBodySchema.omit({ id: true, classeId: true }),
  response: {
    // TODO: SEND A BETTER RESPONSE BODY
    201: turmaBodySchema,
    404: simpleBadRequestSchema,
  },
};

export type createClasseBodyType = z.infer<typeof createClasseSchema.body>;
export type updateClasseBodyType = z.infer<typeof updateClasseSchema.body>;
export type classeParamsType = z.infer<typeof classeParamsSchema>;
export type createTurmaToClasseBodyType = z.infer<
  typeof createTurmaToClasseSchema.body
>;
