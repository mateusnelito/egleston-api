import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';

export const alunoNotaSchema = z.object({
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

export const getAlunosWithoutNotaSchema = {
  summary: 'Retorna a lista de alunos sem notas',
  tags: ['notas'],
  querystring: z.object({
    classeId: z.coerce
      .number({
        required_error: 'O id da classe é obrigatório.',
        invalid_type_error: 'O id da classe deve ser número.',
      })
      .int({ message: 'O id da classe deve ser inteiro.' })
      .positive({ message: 'O id da classe deve ser positivo.' }),
    trimestreId: z.coerce
      .number({
        required_error: 'O id do trimestre é obrigatório.',
        invalid_type_error: 'O id do trimestre deve ser número.',
      })
      .int({ message: 'O id do trimestre deve ser inteiro.' })
      .positive({ message: 'O id do trimestre deve ser positivo.' }),
    disciplinaId: z
      .number({
        required_error: 'O id de disciplina é obrigatório.',
        invalid_type_error: 'O id de disciplina deve ser número.',
      })
      .int({ message: 'O id de disciplina deve ser inteiro.' })
      .positive({ message: 'O id de disciplina deve ser positivo.' }),
  }),
  response: {
    // TODO: ADD 200 RESPONSE SCHEMA
    // 200: {},
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export type alunoNotaDataType = z.infer<typeof alunoNotaSchema>;
export type getAlunosWithoutNotaQueryStringDataType = z.infer<
  typeof getAlunosWithoutNotaSchema.querystring
>;
