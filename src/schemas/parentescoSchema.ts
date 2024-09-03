import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';

const parentescoBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id de parentesco é obrigatório.',
      invalid_type_error: 'O id de parentesco deve ser número.',
    })
    .int({ message: 'O id de parentesco deve ser inteiro.' })
    .positive({ message: 'O id de parentesco deve ser positivo.' }),
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
});

const parentescoParamsSchema = z.object({
  parentescoId: z.coerce
    .number({
      required_error: 'O id de parentesco é obrigatório.',
      invalid_type_error: 'O id de parentesco deve ser número.',
    })
    .int({ message: 'O id de parentesco deve ser inteiro.' })
    .positive({ message: 'O id de parentesco deve ser positivo.' }),
});

export const createParentescoSchema = {
  summary: 'Adiciona um novo parentesco',
  tags: ['parentescos'],
  body: parentescoBodySchema.omit({ id: true }),
  response: {
    201: parentescoBodySchema,
    400: simpleBadRequestSchema,
  },
};

export const updateParentescoSchema = {
  summary: 'Atualiza um parentesco existente',
  tags: ['parentescos'],
  params: parentescoParamsSchema,
  body: parentescoBodySchema.omit({ id: true }),
  response: {
    200: parentescoBodySchema,
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getParentescosSchema = {
  summary: 'Retorna todos os parentescos',
  tags: ['parentescos'],
  response: {
    200: z.object({
      data: z.array(parentescoBodySchema),
    }),
  },
};

export const getParentescoSchema = {
  summary: 'Busca parentesco pelo id',
  tags: ['parentescos'],
  params: parentescoParamsSchema,
  response: {
    200: parentescoBodySchema,
    404: simpleBadRequestSchema,
  },
};

export type createParentescoBodyType = z.infer<
  typeof createParentescoSchema.body
>;
export type updateParentescoBodyType = z.infer<
  typeof updateParentescoSchema.body
>;

export type parentescoParamsType = z.infer<typeof parentescoParamsSchema>;
