import { z } from 'zod';
import { CURSO_NOME_REGEX, DESCRICAO_REGEX } from '../utils/regexPatterns';
import {
  complexBadRequestSchema,
  getAllResourcesParamsSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const disciplinaBodySchema = z.object({
  nome: z
    .string({
      required_error: 'O nome da disciplina é obrigatório.',
      invalid_type_error: 'O nome da disciplina deve ser uma string.',
    })
    .trim()
    .regex(CURSO_NOME_REGEX, {
      message:
        'O nome da disciplina deve começar com uma letra, pode conter apenas letras, números, espaços, hífens e apóstrofos, e deve ter entre 3 e 50 caracteres.',
    }),
  descricao: z
    .string({
      required_error: 'A descrição da disciplina é obrigatória.',
      invalid_type_error: 'A descrição da disciplina deve ser uma string.',
    })
    .trim()
    .regex(DESCRICAO_REGEX, {
      message:
        'A descrição da disciplina deve conter apenas letras, números, espaços e pontuação básica, com comprimento entre 10 e 500 caracteres.',
    }),
});

const disciplinaParamsSchema = z.object({
  disciplinaId: z.coerce
    .number({
      required_error: 'O id de disciplina é obrigatório.',
      invalid_type_error: 'O id de disciplina deve ser número.',
    })
    .int({ message: 'O id de disciplina deve ser inteiro.' })
    .positive({ message: 'O id de disciplina deve ser positivo.' }),
});

const disciplinaOkResponseSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  descricao: z.string(),
});

export const createDisciplinaSchema = {
  summary: 'Adiciona uma nova disciplina',
  tags: ['disciplinas'],
  body: disciplinaBodySchema,
  response: {
    201: disciplinaOkResponseSchema,
    400: simpleBadRequestSchema,
  },
};

export const updateDisciplinaSchema = {
  summary: 'Atualiza uma disciplina existente',
  tags: ['disciplinas'],
  params: disciplinaParamsSchema,
  body: disciplinaBodySchema,
  response: {
    200: disciplinaOkResponseSchema.omit({ id: true }),
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getDisciplinasSchema = {
  summary: 'Retorna todas as disciplinas',
  tags: ['disciplinas'],
  querystring: getAllResourcesParamsSchema,
  response: {
    200: z.object({
      data: z.array(disciplinaOkResponseSchema.omit({ descricao: true })),
      next_cursor: z.number().optional(),
    }),
  },
};

export const getDisciplinaSchema = {
  summary: 'Busca disciplina pelo id',
  tags: ['disciplinas'],
  params: disciplinaParamsSchema,
  response: {
    200: disciplinaOkResponseSchema,
    404: notFoundRequestSchema,
  },
};

export const associateCursosWithDisciplinaSchema = {
  summary: 'Associa Múltiplos cursos à uma disciplina',
  tags: ['disciplinas'],
  params: disciplinaParamsSchema,
  body: z.object({
    cursos: z
      .array(
        z
          .number({
            message: 'O array de cursos deve conter apenas números.',
          })
          .int({
            message: 'O array de cursos deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de cursos deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'Os cursos devem ser  enviadas no formato de array.',
        }
      )
      .nonempty({ message: 'O array de cursos não deve estar vazio.' }),
  }),
  response: {
    // 201: cursoOkResponseSchema,
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export type createDisciplinaBodyType = z.infer<
  typeof createDisciplinaSchema.body
>;
export type updateDisciplinaBodyType = z.infer<
  typeof updateDisciplinaSchema.body
>;

export type uniqueDisciplinaResourceParamsType = z.infer<
  typeof updateDisciplinaSchema.params
>;

export type getDisciplinasQueryStringType = z.infer<
  typeof getDisciplinasSchema.querystring
>;

export type associateCursosWithDisciplinaBodyType = z.infer<
  typeof associateCursosWithDisciplinaSchema.body
>;
