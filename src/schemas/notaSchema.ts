import { z } from 'zod';
import {
  complexBadRequestSchema,
  getResourcesDefaultQueriesSchema,
  simpleBadRequestSchema,
} from './globalSchema';

export const notaSchema = z.object({
  alunoId: z
    .number({
      required_error: 'O id do aluno é obrigatório.',
      invalid_type_error: 'O id do aluno deve ser número.',
    })
    .int({ message: 'O id do aluno deve ser inteiro.' })
    .positive({ message: 'O id do aluno deve ser positivo.' }),
  classeId: z
    .number({
      required_error: 'O id da classe é obrigatório.',
      invalid_type_error: 'O id da classe deve ser número.',
    })
    .int({ message: 'O id da classe deve ser inteiro.' })
    .positive({ message: 'O id da classe deve ser positivo.' }),
  disciplinaId: z
    .number({
      required_error: 'O id de disciplina é obrigatório.',
      invalid_type_error: 'O id de disciplina deve ser número.',
    })
    .int({ message: 'O id de disciplina deve ser inteiro.' })
    .positive({ message: 'O id de disciplina deve ser positivo.' }),
  trimestreId: z
    .number({
      required_error: 'O id do trimestre é obrigatório.',
      invalid_type_error: 'O id do trimestre deve ser número.',
    })
    .int({ message: 'O id do trimestre deve ser inteiro.' })
    .positive({ message: 'O id do trimestre deve ser positivo.' }),
  nota: z
    .number({
      required_error: 'A nota é obrigatória.',
      invalid_type_error: 'A nota deve ser número.',
    })
    .positive({ message: 'A nota deve ser positiva.' })
    .max(20, { message: 'O valor máximo da nota é 20.' })
    .transform((value) => value.toFixed(1)),
});

export const createNotaSchema = {
  summary: 'Cria uma nota',
  tags: ['notas'],
  body: notaSchema,
  response: {
    201: notaSchema.extend({ nota: z.number() }),
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getAlunosAbsentNotaSchema = {
  summary: 'Retorna a lista de alunos sem notas',
  tags: ['notas'],
  querystring: z
    .object({
      classeId: z.coerce
        .number({
          required_error: 'O id da classe é obrigatório.',
          invalid_type_error: 'O id da classe deve ser número.',
        })
        .int({ message: 'O id da classe deve ser inteiro.' })
        .positive({ message: 'O id da classe deve ser positivo.' }),
      turmaId: z.coerce
        .number({
          required_error: 'O id da turma é obrigatório.',
          invalid_type_error: 'O id da turma deve ser número.',
        })
        .int({ message: 'O id da turma deve ser inteiro.' })
        .positive({ message: 'O id da turma deve ser positivo.' }),
      trimestreId: z.coerce
        .number({
          required_error: 'O id do trimestre é obrigatório.',
          invalid_type_error: 'O id do trimestre deve ser número.',
        })
        .int({ message: 'O id do trimestre deve ser inteiro.' })
        .positive({ message: 'O id do trimestre deve ser positivo.' }),
      disciplinaId: z.coerce
        .number({
          required_error: 'O id de disciplina é obrigatório.',
          invalid_type_error: 'O id de disciplina deve ser número.',
        })
        .int({ message: 'O id de disciplina deve ser inteiro.' })
        .positive({ message: 'O id de disciplina deve ser positivo.' }),
    })
    .merge(getResourcesDefaultQueriesSchema),
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
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const createBulkNotaSchema = {
  summary: 'Cria notas em massa',
  tags: ['notas'],
  body: notaSchema.omit({ alunoId: true, nota: true }).extend({
    alunos: z
      .array(
        z.object({
          // TODO: Remover a duplicata desse código
          id: z
            .number({
              required_error: 'O id do aluno é obrigatório.',
              invalid_type_error: 'O id do aluno deve ser número.',
            })
            .int({ message: 'O id do aluno deve ser inteiro.' })
            .positive({ message: 'O id do aluno deve ser positivo.' }),
          nota: z
            .number({
              required_error: 'A nota é obrigatória.',
              invalid_type_error: 'A nota deve ser número.',
            })
            .positive({ message: 'A nota deve ser positiva.' })
            .max(20, { message: 'O valor máximo da nota é 20.' })
            .transform((value) => value.toFixed(1)),
        }),
        {
          required_error: 'Alunos são obrigatórios',
          invalid_type_error: 'Alunos deve ser um array',
        }
      )
      .nonempty({ message: 'Array de alunos não pode estar vazio.' }),
  }),
  response: {
    201: z.object({
      data: notaSchema.omit({ alunoId: true, nota: true }).extend({
        notas: z.array(
          notaSchema.pick({ alunoId: true }).extend({ nota: z.number() })
        ),
      }),
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export type notaDataType = z.infer<typeof notaSchema>;
export type getAlunosWithoutNotaQueryStringDataType = z.infer<
  typeof getAlunosAbsentNotaSchema.querystring
>;
export type bulkNotaDataType = z.infer<typeof createBulkNotaSchema.body>;
