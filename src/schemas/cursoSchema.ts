import { z } from 'zod';
import { CURSO_NOME_REGEX, DESCRICAO_REGEX } from '../utils/regexPatterns';
import {
  complexBadRequestSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const cursoBodySchema = z.object({
  nome: z
    .string({
      required_error: 'O nome do curso é obrigatório.',
      invalid_type_error: 'O nome do curso deve ser uma string.',
    })
    .trim()
    .regex(CURSO_NOME_REGEX, {
      message:
        'O nome do curso deve começar com uma letra, pode conter apenas letras, números, espaços, hífens e apóstrofos, e deve ter entre 3 e 50 caracteres.',
    }),
  descricao: z
    .string({
      required_error: 'A descrição do curso é obrigatória.',
      invalid_type_error: 'A descrição do curso deve ser uma string.',
    })
    .trim()
    .regex(DESCRICAO_REGEX, {
      message:
        'A descrição do curso deve conter apenas letras, números, espaços e pontuação básica, com comprimento entre 10 e 500 caracteres.',
    }),
  duracao: z
    .number({
      required_error: 'A duração do curso é obrigatória.',
      invalid_type_error: 'A duração do curso deve ser um número.',
    })
    .int({
      message: 'A duração do curso deve ser um número inteiro.',
    })
    .min(1, {
      message: 'A duração do curso deve ser de pelo menos 1 ano.',
    })
    .max(10, {
      message: 'A duração do curso deve ser de no máximo 10 anos.',
    }),
  disciplinas: z
    .array(z.number().int().positive(), {
      invalid_type_error:
        'As disciplinas devem ser  enviadas no formato de array.',
      message:
        'O array de disciplinas deve conter apenas números inteiros positivos.',
    })
    .optional(),
});

const cursoParamsSchema = z.object({
  cursoId: z.coerce
    .number({
      required_error: 'O id de curso é obrigatório.',
      invalid_type_error: 'O id de curso deve ser número.',
    })
    .int({ message: 'O id de curso deve ser inteiro.' })
    .positive({ message: 'O id de curso deve ser positivo.' }),
});

const cursoOkResponseSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  descricao: z.string(),
  duracao: z.number().int().positive(),
});

export const cursoDisciplinasAssociationSchema = {
  tags: ['cursos'],
  params: cursoParamsSchema,
  body: z.object({
    disciplinas: z
      .array(
        z
          .number({
            message: 'O array de disciplinas deve conter apenas números.',
          })
          .int({
            message:
              'O array de disciplinas deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de disciplinas deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'As disciplinas devem ser  enviadas no formato de array.',
        }
      )
      .nonempty({ message: 'O array de disciplinas não deve estar vazio.' }),
  }),
  response: {
    200: cursoOkResponseSchema.omit({ id: true }).extend({
      disciplinas: z.array(z.number().int().positive()).optional(),
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema.or(notFoundRequestSchema),
  },
};

export const createCursoSchema = {
  summary: 'Adiciona um novo curso',
  tags: ['cursos'],
  body: cursoBodySchema.extend({
    disciplinas: z
      .array(
        z
          .number({
            message: 'O array de disciplinas deve conter apenas números.',
          })
          .int({
            message:
              'O array de disciplinas deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de disciplinas deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'As disciplinas devem ser  enviadas no formato de array.',
        }
      )
      .optional(),
  }),
  response: {
    201: cursoOkResponseSchema.extend({
      disciplinas: z.array(z.number().int().positive()).optional(),
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const updateCursoSchema = {
  summary: 'Atualiza um curso existente',
  tags: ['cursos'],
  params: cursoParamsSchema,
  body: cursoBodySchema,
  response: {
    200: cursoOkResponseSchema.omit({ id: true }),
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getCursosSchema = {
  summary: 'Retorna todos os cursos',
  tags: ['cursos'],
  response: {
    200: z.object({
      data: z.array(
        cursoOkResponseSchema.omit({ descricao: true, duracao: true })
      ),
    }),
  },
};

export const getCursoSchema = {
  summary: 'Busca curso pelo id',
  tags: ['cursos'],
  params: cursoParamsSchema,
  response: {
    200: cursoOkResponseSchema,
    404: notFoundRequestSchema,
  },
};

export const createCursoDisciplinasAssociationSchema = {
  summary: 'Associa Múltiplas disciplinas à um curso',
  ...cursoDisciplinasAssociationSchema,
};

export const deleteCursoDisciplinaAssociationSchema = {
  summary: 'Remove associação entre curso e disciplina',
  tags: ['cursos'],
  params: cursoParamsSchema.extend({
    disciplinaId: z.coerce
      .number({
        required_error: 'O id de disciplina é obrigatório.',
        invalid_type_error: 'O id de disciplina deve ser número.',
      })
      .int({ message: 'O id de disciplina deve ser inteiro.' })
      .positive({ message: 'O id de disciplina deve ser positivo.' }),
  }),
  response: {
    404: notFoundRequestSchema,
  },
};

export const deleteCursoDisciplinasAssociationSchema = {
  summary: 'Deleta múltiplas disciplinas associadas à um curso',
  ...cursoDisciplinasAssociationSchema,
};

export const getCursoClassesSchema = {
  summary: 'Retorna todas as classes do curso',
  tags: ['cursos'],
  params: cursoParamsSchema,
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number().int().positive(),
          nome: z.string(),
          anoLectivo: z.string(),
        })
      ),
    }),
    404: notFoundRequestSchema,
  },
};

export type createCursoBodyType = z.infer<typeof createCursoSchema.body>;
export type updateCursoBodyType = z.infer<typeof updateCursoSchema.body>;

export type uniqueCursoResourceParamsType = z.infer<
  typeof updateCursoSchema.params
>;

export type cursoDisciplinasAssociationBodyType = z.infer<
  typeof createCursoDisciplinasAssociationSchema.body
>;

export type deleteCursoDisciplinaAssociationParamsType = z.infer<
  typeof deleteCursoDisciplinaAssociationSchema.params
>;
