import { z } from 'zod';
import { cursoNomeRegEx, descricaoRegEx } from '../utils/regexPatterns';
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
  body: cursoBodySchema.omit({ id: true }),
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
  summary: 'Retorna um curso',
  tags: ['cursos'],
  params: cursoParamsSchema,
  response: {
    200: cursoBodySchema,
    404: simpleBadRequestSchema,
  },
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

export type createCursoBodyType = z.infer<typeof createCursoSchema.body>;
export type updateCursoBodyType = z.infer<typeof updateCursoSchema.body>;
export type cursoParamsType = z.infer<typeof cursoParamsSchema>;

export type getCursoClassesQueryType = z.infer<
  typeof getCursoClassesSchema.querystring
>;
