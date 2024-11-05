import { z } from 'zod';
import {
  complexBadRequestSchema,
  getResourcesDefaultQueriesSchema,
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
  ordem: z
    .number({
      required_error: 'A ordem é obrigatória.',
      invalid_type_error: 'A ordem deve ser número.',
    })
    .int({ message: 'A ordem deve ser inteiro.' })
    .positive({ message: 'A ordem deve ser positivo.' })
    .min(1, { message: 'A ordem no minimo deve ser 1' })
    .max(4, { message: 'A ordem no máximo deve ser 4' }),
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
    .positive({ message: 'O valor da matrícula deve ser positivo.' })
    .transform((value) => Number(value.toFixed(2))),
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
    201: classeBodySchema.omit({ cursoId: true }).extend({
      valorMatricula: z.number(),
      curso: z.object({
        id: z.number().int(),
        nome: z.string(),
      }),
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
    200: classeBodySchema.omit({ cursoId: true }).extend({
      valorMatricula: z.number(),
      curso: z.object({
        id: z.number().int(),
        nome: z.string(),
      }),
    }),
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getClassesSchema = {
  summary: 'Retorna todas as classes',
  tags: ['classes'],
  querystring: z.object({
    cursoId: z.coerce
      .number({
        required_error: 'O id do curso é obrigatório.',
        invalid_type_error: 'O id do curso deve ser número.',
      })
      .int({ message: 'O id do curso deve ser inteiro.' })
      .positive({ message: 'O id do curso deve ser positivo.' }),
    anoLectivoId: z.coerce
      .number({
        required_error: 'O id do ano-lectivo é obrigatório.',
        invalid_type_error: 'O id do ano-lectivo deve ser número.',
      })
      .int({ message: 'O id do ano-lectivo deve ser inteiro.' })
      .positive({ message: 'O id do ano-lectivo deve ser positivo.' })
      .optional(),
  }),
  response: {
    404: simpleBadRequestSchema,
  },
};

export const getClasseSchema = {
  summary: 'Retorna uma classe',
  tags: ['classes'],
  params: classeParamsSchema,
  response: {
    200: classeBodySchema.omit({ cursoId: true }).extend({
      valorMatricula: z.number(),
      curso: z.object({
        id: z.number().int(),
        nome: z.string(),
      }),
      anoLectivo: z.object({
        id: z.number().int(),
        nome: z.string(),
      }),
    }),
    404: simpleBadRequestSchema,
  },
};

export const getNextClasseSchema = {
  summary: 'Retorna a próxima classe após a selecionada',
  tags: ['classes'],
  params: classeParamsSchema,
  response: {
    200: classeBodySchema.omit({ cursoId: true }).extend({
      valorMatricula: z.number(),
      anoLectivo: z.object({
        id: z.number().int(),
        nome: z.string(),
      }),
    }),
    204: z.object({}),
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
        turmaBodySchema
          .omit({ salaId: true, classeId: true, turnoId: true })
          .extend({
            turno: z.object({
              id: z.number().int(),
              nome: z.string(),
            }),
          })
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

export const getClasseAlunosSchema = {
  summary: 'Retorna todas os alunos de uma classe',
  tags: ['classes'],
  params: classeParamsSchema,
  querystring: getResourcesDefaultQueriesSchema.extend({
    turmaId: z.coerce
      .number({
        required_error: 'O id da turma é obrigatório.',
        invalid_type_error: 'O id da turma deve ser número.',
      })
      .int({ message: 'O id da turma deve ser inteiro.' })
      .positive({ message: 'O id da turma deve ser positivo.' })
      .optional(),
  }),
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number(),
          nomeCompleto: z.string(),
        })
      ),
      next_cursor: z.number().optional(),
    }),
    404: simpleBadRequestSchema,
  },
};

export const getClasseDisciplinasSchema = {
  summary: 'Retorna todas as disciplinas da classe',
  tags: ['classes'],
  params: classeParamsSchema,
  response: {
    200: z.object({
      data: z.array(z.object({ id: z.number(), nome: z.string() })),
    }),
    404: simpleBadRequestSchema,
  },
};

export const getClasseDisciplinasAbsentProfessorSchema = {
  summary: 'Retorna todas as disciplinas sem professor',
  tags: ['classes'],
  params: classeParamsSchema.merge(
    z.object({
      turmaId: z.coerce
        .number({
          required_error: 'O id da turma é obrigatório.',
          invalid_type_error: 'O id da turma deve ser número.',
        })
        .int({ message: 'O id da turma deve ser inteiro.' })
        .positive({ message: 'O id da turma deve ser positivo.' }),
    })
  ),
  response: {
    200: z.object({
      data: z.array(z.object({ id: z.number(), nome: z.string() })),
    }),
    404: simpleBadRequestSchema,
  },
};

export type createClasseBodyType = z.infer<typeof createClasseSchema.body>;
export type updateClasseBodyType = z.infer<typeof updateClasseSchema.body>;
export type classeParamsType = z.infer<typeof classeParamsSchema>;
export type getClassesQueryStringType = z.infer<
  typeof getClassesSchema.querystring
>;
export type createTurmaToClasseBodyType = z.infer<
  typeof createTurmaToClasseSchema.body
>;

export type getClasseAlunosQueryStringType = z.infer<
  typeof getClasseAlunosSchema.querystring
>;

export type getClasseAbsentDisciplinasParamsType = z.infer<
  typeof getClasseDisciplinasAbsentProfessorSchema.params
>;
