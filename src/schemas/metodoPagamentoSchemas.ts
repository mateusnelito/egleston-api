import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';
const metodoPagamentoBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do metodo de pagamento é obrigatório.',
      invalid_type_error: 'O id do metodo de pagamento deve ser número.',
    })
    .int({ message: 'O id do metodo de pagamento deve ser inteiro.' })
    .positive({ message: 'O id do metodo de pagamento deve ser positivo.' }),
  nome: z
    .string({
      required_error: 'O nome do metodo de pagamento é obrigatório.',
      invalid_type_error: 'O nome do metodo de pagamento deve ser string.',
    })
    .trim()
    .min(1, {
      message:
        'O nome do metodo de pagamento deve possuir no mínimo 1 caracteres.',
    })
    .max(50, {
      message:
        'O nome do metodo de pagamento deve possuir no máximo 50 caracteres.',
    }),
  // TODO: Add appropriated regex
});

const metodoPagamentoParamsSchema = z.object({
  metodoPagamentoId: z.coerce
    .number({
      required_error: 'O id do metodo de pagamento é obrigatório.',
      invalid_type_error: 'O id do metodo de pagamento deve ser número.',
    })
    .int({ message: 'O id do metodo de pagamento deve ser inteiro.' })
    .positive({ message: 'O id do metodo de pagamento deve ser positivo.' }),
});

export const createMetodoPagamentoSchema = {
  summary: 'Adiciona um novo metodo de pagamento',
  tags: ['metodos-pagamento'],
  body: metodoPagamentoBodySchema.omit({ id: true }),
  response: {
    201: metodoPagamentoBodySchema,
    400: simpleBadRequestSchema,
  },
};

export const updateMetodoPagamentoSchema = {
  summary: 'Atualiza um metodo de pagamento existente',
  tags: ['metodos-pagamento'],
  params: metodoPagamentoParamsSchema,
  body: metodoPagamentoBodySchema.omit({ id: true }),
  response: {
    200: metodoPagamentoBodySchema,
    404: simpleBadRequestSchema,
  },
};

export const getMetodoPagamentoSchema = {
  summary: 'Retorna um metodo de pagamento',
  tags: ['metodos-pagamento'],
  params: metodoPagamentoParamsSchema,
  response: {
    200: metodoPagamentoBodySchema,
    404: simpleBadRequestSchema,
  },
};

export const getMetodosPagamentoSchema = {
  summary: 'Retorna todos metodos de pagamento',
  tags: ['metodos-pagamento'],
  response: {
    200: z.object({
      data: z.array(metodoPagamentoBodySchema),
    }),
    404: simpleBadRequestSchema,
  },
};

export type createMetodoPagamentoBodyType = z.infer<
  typeof createMetodoPagamentoSchema.body
>;

export type metodoPagamentoParamsType = z.infer<
  typeof metodoPagamentoParamsSchema
>;
