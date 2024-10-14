import { z } from 'zod';
import { cursoNomeRegEx, descricaoRegEx } from '../utils/regexPatterns';
import { classeBodySchema } from './classeSchemas';
import {
  complexBadRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const cursoBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do curso é obrigatório.',
      invalid_type_error: 'O id do curso deve ser número.',
    })
    .int({ message: 'O id do curso deve ser inteiro.' })
    .positive({ message: 'O id do curso deve ser positivo.' }),
  nome: z
    .string({
      required_error: 'O nome do curso é obrigatório.',
      invalid_type_error: 'O nome do curso deve ser uma string.',
    })
    .trim()
    .regex(cursoNomeRegEx, {
      message:
        'O nome do curso deve começar com uma letra, pode conter apenas letras, números, espaços, hífens e apóstrofos, e deve ter entre 3 e 50 caracteres.',
    }),
  descricao: z
    .string({
      required_error: 'A descrição do curso é obrigatória.',
      invalid_type_error: 'A descrição do curso deve ser uma string.',
    })
    .trim()
    .regex(descricaoRegEx, {
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

export const createCursoSchema = {
  summary: 'Adiciona um novo curso',
  tags: ['cursos'],
  body: cursoBodySchema.omit({ id: true }).extend({
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
      .nonempty({ message: 'O array de disciplinas não deve estar vazio.' })
      .optional(),
  }),
  response: {
    201: cursoBodySchema,
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const updateCursoSchema = {
  summary: 'Atualiza um curso existente',
  tags: ['cursos'],
  params: cursoParamsSchema,
  body: cursoBodySchema.omit({ id: true }),
  response: {
    200: cursoBodySchema,
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getCursosSchema = {
  summary: 'Retorna todos os cursos',
  tags: ['cursos'],
  response: {
    200: z.object({
      data: z.array(cursoBodySchema.omit({ descricao: true, duracao: true })),
    }),
  },
};

export const getCursoSchema = {
  summary: 'Busca curso pelo id',
  tags: ['cursos'],
  params: cursoParamsSchema,
  response: {
    200: cursoBodySchema,
    404: simpleBadRequestSchema,
  },
};

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
    200: cursoBodySchema.omit({ id: true }).extend({
      disciplinas: z.array(z.number().int().positive()).optional(),
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const createMultiplesCursoDisciplinaSchema = {
  summary: 'Associa Múltiplas disciplinas à um curso',
  ...cursoDisciplinasAssociationSchema,
};

export const deleteCursoDisciplinaSchema = {
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
    404: simpleBadRequestSchema,
  },
};

export const deleteMultiplesCursoDisciplinaSchema = {
  summary: 'Deleta múltiplas disciplinas associadas à um curso',
  ...cursoDisciplinasAssociationSchema,
};

export const getCursoClassesSchema = {
  summary: 'Retorna todas as classes do curso',
  tags: ['cursos'],
  params: cursoParamsSchema,
  querystring: z.object({
    anoLectivoId: z.coerce
      .number({
        required_error: 'O id do ano lectivo é obrigatório.',
        invalid_type_error: 'O id do ano lectivo deve ser número.',
      })
      .int({ message: 'O id do ano lectivo deve ser inteiro.' })
      .positive({ message: 'O id do ano lectivo deve ser positivo.' })
      .nullish(),
  }),
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number().int().positive(),
          nome: z.string(),
        })
      ),
    }),
    404: simpleBadRequestSchema,
  },
};

export const createClasseToCursoSchema = {
  summary: 'Adiciona uma classe ao curso',
  tags: ['cursos'],
  params: cursoParamsSchema,
  body: classeBodySchema.omit({ id: true, cursoId: true }),
  response: {
    201: classeBodySchema.extend({
      valorMatricula: z.coerce.number(),
    }),
    400: simpleBadRequestSchema.or(
      z.object({
        statusCode: z.number().default(400),
        message: z.string(),
      })
    ),
    404: simpleBadRequestSchema,
  },
};

export const getCursoDisciplinasSchema = {
  summary: 'Retorna todas as disciplinas do curso',
  tags: ['cursos'],
  params: cursoParamsSchema,
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number().int().positive(),
          nome: z.string(),
        })
      ),
    }),
    404: simpleBadRequestSchema,
  },
};

export type createCursoBodyType = z.infer<typeof createCursoSchema.body>;
export type updateCursoBodyType = z.infer<typeof updateCursoSchema.body>;

export type cursoParamsType = z.infer<typeof cursoParamsSchema>;

export type cursoDisciplinaAssociationBodyType = z.infer<
  typeof createMultiplesCursoDisciplinaSchema.body
>;

export type deleteCursoDisciplinaParamsType = z.infer<
  typeof deleteCursoDisciplinaSchema.params
>;

export type createClasseToCursoBodyType = z.infer<
  typeof createClasseToCursoSchema.body
>;

export type getCursoClassesQueryType = z.infer<
  typeof getCursoClassesSchema.querystring
>;
