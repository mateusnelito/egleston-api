import { z } from 'zod';
import { notFoundRequestSchema, simpleBadRequestSchema } from './globalSchema';
export const createParentescoSchema = {
  summary: 'Adiciona um novo parentesco',
  tags: ['parentescos'],
  body: z.object({
    nome: z
      .string({
        required_error: 'O nome de parentesco é obrigatório.',
        invalid_type_error: 'O nome de parentesco deve ser uma string.',
      })
      .trim()
      .min(2, {
        message: 'O nome de parentesco deve ter pelo menos 2 caracteres.',
      })
      .max(30, {
        message: 'O nome de parentesco deve ter no máximo 30 caracteres.',
      })
      .regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
        message:
          'O nome de parentesco deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
      }),
  }),
  response: {
    201: z.object({
      id: z.number().int().positive(),
      nome: z.string(),
    }),
    400: simpleBadRequestSchema,
  },
};

export const updateParentescoSchema = {
  summary: 'Atualiza um parentesco existente',
  tags: ['parentescos'],
  params: z.object({
    parentescoId: z.coerce
      .number({
        required_error: 'O id de parentesco é obrigatório.',
        invalid_type_error: 'O id de parentesco deve ser número.',
      })
      .int({ message: 'O id de parentesco deve ser inteiro.' })
      .positive({ message: 'O id de parentesco deve ser positivo.' }),
  }),
  body: z.object({
    nome: z
      .string({
        required_error: 'O nome de parentesco é obrigatório.',
        invalid_type_error: 'O nome de parentesco deve ser uma string.',
      })
      .trim()
      .min(2, {
        message: 'O nome de parentesco deve ter pelo menos 2 caracteres.',
      })
      .max(30, {
        message: 'O nome de parentesco deve ter no máximo 30 caracteres.',
      })
      .regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
        message:
          'O nome de parentesco deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
      }),
  }),
  response: {
    200: z.object({
      nome: z.string(),
    }),
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getParentescosSchema = {
  summary: 'Retorna todos os parentescos',
  tags: ['parentescos'],
  querystring: z.object({
    page_size: z.coerce
      .number({
        invalid_type_error: 'O tamanho da página deve ser número.',
      })
      .int({ message: 'O tamanho da página deve ser inteiro.' })
      .positive({ message: 'O tamanho da página deve ser positivo.' })
      .default(10),
    cursor: z.coerce
      .number({
        invalid_type_error: 'O cursor deve ser número.',
      })
      .int({ message: 'O cursor deve ser inteiro.' })
      .positive({ message: 'O cursor deve ser positivo.' })
      .min(2, { message: 'O valor do cursor dever ser no minimo 2.' })
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
      next_cursor: z.number().optional(),
    }),
  },
};

export const getParentescoSchema = {
  summary: 'Busca parentesco pelo id',
  tags: ['parentescos'],
  params: z.object({
    parentescoId: z.coerce
      .number({
        required_error: 'O id de parentesco é obrigatório.',
        invalid_type_error: 'O id de parentesco deve ser número.',
      })
      .int({ message: 'O id de parentesco deve ser inteiro.' })
      .positive({ message: 'O id de parentesco deve ser positivo.' }),
  }),
  response: {
    200: z.object({
      id: z.number().int().positive(),
      nome: z.string(),
    }),
    404: notFoundRequestSchema,
  },
};

export type createParentescoBodyType = z.infer<
  typeof createParentescoSchema.body
>;
export type updateParentescoBodyType = z.infer<
  typeof updateParentescoSchema.body
>;

export type uniqueParentescoResourceParamsType = z.infer<
  typeof updateParentescoSchema.params
>;

export type getParentescosQueryStringType = z.infer<
  typeof getParentescosSchema.querystring
>;
