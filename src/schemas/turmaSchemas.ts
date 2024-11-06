import { z } from 'zod';
import {
  getResourcesDefaultQueriesSchema,
  simpleBadRequestSchema,
} from './globalSchema';

export const turmaBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id da turma é obrigatório.',
      invalid_type_error: 'O id da turma deve ser número.',
    })
    .int({ message: 'O id da turma deve ser inteiro.' })
    .positive({ message: 'O id da turma deve ser positivo.' }),
  // TODO: Add appropriated nome regex
  nome: z
    .string({
      required_error: 'O nome da turma é obrigatório.',
      invalid_type_error: 'O nome da turma deve ser string.',
    })
    .trim()
    .min(1, {
      message: 'O nome da turma deve possuir no mínimo 1 caracteres.',
    })
    .max(30, {
      message: 'O nome da turma deve possuir no máximo 30 caracteres.',
    }),
  classeId: z
    .number({
      required_error: 'O id da classe é obrigatório.',
      invalid_type_error: 'O id da classe deve ser número.',
    })
    .int({ message: 'O id da classe deve ser inteiro.' })
    .positive({ message: 'O id da classe deve ser positivo.' }),
  salaId: z
    .number({
      required_error: 'O id da sala é obrigatório.',
      invalid_type_error: 'O id da sala deve ser número.',
    })
    .int({ message: 'O id da sala deve ser inteiro.' })
    .positive({ message: 'O id da sala deve ser positivo.' }),
  turnoId: z
    .number({
      required_error: 'O id do turno é obrigatório.',
      invalid_type_error: 'O id do turno deve ser número.',
    })
    .int({ message: 'O id do turno deve ser inteiro.' })
    .positive({ message: 'O id do turno deve ser positivo.' }),
});

const turmaParamsSchema = z.object({
  turmaId: z.coerce
    .number({
      required_error: 'O id da turma é obrigatório.',
      invalid_type_error: 'O id da turma deve ser número.',
    })
    .int({ message: 'O id da turma deve ser inteiro.' })
    .positive({ message: 'O id da turma deve ser positivo.' }),
});

export const createTurmaSchema = {
  summary: 'Adiciona uma nova turma',
  tags: ['turmas'],
  body: turmaBodySchema.omit({ id: true }),
  response: {
    201: turmaBodySchema,
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const updateTurmaSchema = {
  summary: 'Atualiza uma turma existente',
  tags: ['turmas'],
  params: turmaParamsSchema,
  body: turmaBodySchema.omit({ id: true }),
  response: {
    200: turmaBodySchema.omit({ id: true }),
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getTurmaSchema = {
  summary: 'Retorna uma turma',
  tags: ['turmas'],
  params: turmaParamsSchema,
  response: {
    200: turmaBodySchema
      .omit({ classeId: true, salaId: true, turnoId: true })
      .extend({
        classe: z.object({
          id: z.number(),
          nome: z.string(),
        }),
        sala: z.object({
          id: z.number(),
          nome: z.string(),
        }),
        turno: z.object({
          id: z.number(),
          nome: z.string(),
        }),
      }),
    404: simpleBadRequestSchema,
  },
};

export const getTurmaProfessoresSchema = {
  summary: 'Retorna todos os professores de uma turma',
  tags: ['turmas'],
  params: turmaParamsSchema,
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number().positive(),
          nomeCompleto: z.string(),
          disciplinas: z.array(
            z.object({
              id: z.number().positive(),
              nome: z.string(),
            })
          ),
        })
      ),
    }),
    404: simpleBadRequestSchema,
  },
};

export const getTurmaAlunosSchema = {
  summary: 'Retorna todos os alunos da turma',
  tags: ['turmas'],
  params: turmaParamsSchema,
  querystring: getResourcesDefaultQueriesSchema,
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number().positive(),
          nomeCompleto: z.string(),
          numeroBi: z.string(),
          dataNascimento: z.string().date(),
          genero: z.enum(['M', 'F']),
        })
      ),
      next_cursor: z.number().optional(),
    }),
    404: simpleBadRequestSchema,
  },
};

export type turmaBodyType = z.infer<typeof createTurmaSchema.body>;
export type turmaParamsType = z.infer<typeof turmaParamsSchema>;
