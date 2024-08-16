import { z } from 'zod';
import { createAlunoBodySchema } from './alunoSchemas';
import { complexBadRequestSchema } from './globalSchema';

const matriculaBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id da matricula é obrigatório.',
      invalid_type_error: 'O id da matricula deve ser número.',
    })
    .int({ message: 'O id da matricula deve ser inteiro.' })
    .positive({ message: 'O id da matricula deve ser positivo.' }),
  aluno: createAlunoBodySchema,
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
  // FIXME: REMOVE, IT'S MUST BE DYNAMIC
  anoLectivoId: z
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
});

export const createMatriculaSchema = {
  summary: 'Cria uma nova matricula',
  tags: ['matriculas'],
  body: matriculaBodySchema.omit({ id: true }),
  response: {
    // 201: matriculaBodySchema,
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export type createMatriculaBodyType = z.infer<
  typeof createMatriculaSchema.body
>;
