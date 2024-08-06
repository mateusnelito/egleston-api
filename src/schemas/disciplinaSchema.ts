import { z } from 'zod';
import { cursoNomeRegEx, descricaoRegEx } from '../utils/regexPatterns';
import {
  complexBadRequestSchema,
  getAllResourcesQueriesSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const disciplinaBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id de disciplina é obrigatório.',
      invalid_type_error: 'O id de disciplina deve ser número.',
    })
    .int({ message: 'O id de disciplina deve ser inteiro.' })
    .positive({ message: 'O id de disciplina deve ser positivo.' }),
  nome: z
    .string({
      required_error: 'O nome da disciplina é obrigatório.',
      invalid_type_error: 'O nome da disciplina deve ser uma string.',
    })
    .trim()
    .regex(cursoNomeRegEx, {
      message:
        'O nome da disciplina deve começar com uma letra, pode conter apenas letras, números, espaços, hífens e apóstrofos, e deve ter entre 3 e 50 caracteres.',
    }),
  descricao: z
    .string({
      required_error: 'A descrição da disciplina é obrigatória.',
      invalid_type_error: 'A descrição da disciplina deve ser uma string.',
    })
    .trim()
    .regex(descricaoRegEx, {
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

export const createDisciplinaSchema = {
  summary: 'Adiciona uma nova disciplina',
  tags: ['disciplinas'],
  body: disciplinaBodySchema.omit({ id: true }),
  response: {
    201: disciplinaBodySchema,
    400: simpleBadRequestSchema,
  },
};

export const updateDisciplinaSchema = {
  summary: 'Atualiza uma disciplina existente',
  tags: ['disciplinas'],
  params: disciplinaParamsSchema,
  body: disciplinaBodySchema.omit({ id: true }),
  response: {
    200: disciplinaBodySchema,
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getDisciplinasSchema = {
  summary: 'Retorna todas as disciplinas',
  tags: ['disciplinas'],
  querystring: getAllResourcesQueriesSchema,
  response: {
    200: z.object({
      data: z.array(disciplinaBodySchema.omit({ descricao: true })),
      next_cursor: z.number().optional(),
    }),
  },
};

export const getDisciplinaSchema = {
  summary: 'Retorna uma disciplina',
  tags: ['disciplinas'],
  params: disciplinaParamsSchema,
  response: {
    200: disciplinaBodySchema,
    404: notFoundRequestSchema,
  },
};

export const createMultiplesCursoDisciplinaSchema = {
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
    404: complexBadRequestSchema.or(notFoundRequestSchema),
  },
};

export type createDisciplinaBodyType = z.infer<
  typeof createDisciplinaSchema.body
>;
export type updateDisciplinaBodyType = z.infer<
  typeof updateDisciplinaSchema.body
>;

export type disciplinaParamsType = z.infer<typeof disciplinaParamsSchema>;

export type getDisciplinasQueryStringType = z.infer<
  typeof getDisciplinasSchema.querystring
>;

export type createCursoDisciplinaBodyType = z.infer<
  typeof createMultiplesCursoDisciplinaSchema.body
>;
