import { z } from 'zod';
import { createAlunoBodySchema } from './alunoSchemas';
import {
  complexBadRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const matriculaBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id da matricula é obrigatório.',
      invalid_type_error: 'O id da matricula deve ser número.',
    })
    .int({ message: 'O id da matricula deve ser inteiro.' })
    .positive({ message: 'O id da matricula deve ser positivo.' }),
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
  cursoId: z
    .number({
      required_error: 'O id de curso é obrigatório.',
      invalid_type_error: 'O id de curso deve ser número.',
    })
    .int({ message: 'O id de curso deve ser inteiro.' })
    .positive({ message: 'O id de curso deve ser positivo.' }),
  turmaId: z
    .number({
      required_error: 'O id da turma é obrigatório.',
      invalid_type_error: 'O id da turma deve ser número.',
    })
    .int({ message: 'O id da turma deve ser inteiro.' })
    .positive({ message: 'O id da turma deve ser positivo.' }),
  metodoPagamentoId: z
    .number({
      required_error: 'O id do metodo de pagamento é obrigatório.',
      invalid_type_error: 'O id do metodo de pagamento deve ser número.',
    })
    .int({ message: 'O id do metodo de pagamento deve ser inteiro.' })
    .positive({ message: 'O id do metodo de pagamento deve ser positivo.' }),
  createdAt: z.date({ message: 'createdAt deve ser uma data.' }).nullable(),
});

const matriculaParamsSchema = z.object({
  matriculaId: z.coerce
    .number({
      required_error: 'O id da matricula é obrigatório.',
      invalid_type_error: 'O id da matricula deve ser número.',
    })
    .int({ message: 'O id da matricula deve ser inteiro.' })
    .positive({ message: 'O id da matricula deve ser positivo.' }),
});

export const createAlunoMatriculaSchema = {
  summary: 'Cria uma nova matricula',
  tags: ['matriculas'],
  body: matriculaBodySchema
    .extend({
      aluno: createAlunoBodySchema,
    })
    .omit({ id: true, alunoId: true, createdAt: true }),
  response: {
    // 201: matriculaBodySchema,
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const updateMatriculaSchema = {
  summary: 'Atualiza uma matricula existente',
  tags: ['matriculas'],
  params: matriculaParamsSchema,
  body: matriculaBodySchema.omit({
    id: true,
    alunoId: true,
    createdAt: true,
  }),
  response: {
    // 200: {},
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export type matriculaBodyType = z.infer<typeof matriculaBodySchema>;
export type createAlunoMatriculaBodyType = z.infer<
  typeof createAlunoMatriculaSchema.body
>;
export type matriculaParamsType = z.infer<typeof matriculaParamsSchema>;
export type updateMatriculaBodyType = z.infer<
  typeof updateMatriculaSchema.body
>;
