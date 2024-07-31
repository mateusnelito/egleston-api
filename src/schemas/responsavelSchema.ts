import { z } from 'zod';
import {
  FULL_NAME_REGEX,
  OUTROS_CONTACTOS_REGEX,
} from '../utils/regexPatterns';
import { contactoSchema } from './contactoSchema';
import { enderecoSchema } from './enderecoSchema';
import { notFoundRequestSchema, simpleBadRequestSchema } from './globalSchema';

export const responsavelBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do responsavel é obrigatório.',
      invalid_type_error: 'O id do responsavel deve ser número.',
    })
    .int({ message: 'O id do responsavel deve ser inteiro.' })
    .positive({ message: 'O id do responsavel deve ser positivo.' }),
  nomeCompleto: z
    .string({
      required_error: 'O nome completo é obrigatório.',
      invalid_type_error: 'O nome completo deve ser uma string.',
    })
    .trim()
    .min(10, {
      message: 'O nome completo deve possuir no mínimo 10 caracteres.',
    })
    .max(100, {
      message: 'O nome completo deve possuir no máximo 100 caracteres.',
    })
    .regex(FULL_NAME_REGEX, {
      message:
        'O nome completo deve possuir apenas caracteres alfabéticos e espaços.',
    }),
  parentescoId: z.coerce
    .number({
      required_error: 'O id de parentesco é obrigatório.',
      invalid_type_error: 'O id do parentesco deve ser número.',
    })
    .int({ message: 'O id do parentesco deve ser inteiro.' })
    .positive({ message: 'O id do parentesco deve ser positivo.' }),
});

export const createResponsavelBodySchema = responsavelBodySchema
  .omit({ id: true })
  .extend({
    endereco: enderecoSchema,
    contacto: contactoSchema.extend({
      outros: z
        .string({
          invalid_type_error:
            'Outros contactos devem estar em formato de string.',
        })
        .trim()
        .regex(OUTROS_CONTACTOS_REGEX, {
          message:
            'Outros contactos deve possuir entre 5 e 255 caracteres e conter apenas letras, números, espaços, e os caracteres especiais comuns (.,;:\'"-())',
        })
        .optional(),
    }),
  });

export const responsavelParamsSchema = z.object({
  responsavelId: z.coerce
    .number({
      required_error: 'O id do responsavel é obrigatório.',
      invalid_type_error: 'O id do responsavel deve ser número.',
    })
    .int({ message: 'O id do responsavel deve ser inteiro.' })
    .positive({ message: 'O id do responsavel deve ser positivo.' }),
});

export const updateResponsavelSchema = {
  summary: 'Atualiza um responsavel existente',
  tags: ['responsaveis'],
  params: responsavelParamsSchema,
  body: responsavelBodySchema,
  response: {
    200: z.object({
      nomeCompleto: z.string(),
    }),
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const deleteResponsavelSchema = {
  summary: 'Deleta um responsavel existente',
  tags: ['responsaveis'],
  params: responsavelParamsSchema,
  response: {
    200: z.object({
      id: z.number().int().positive(),
      alunoId: z.number().int().positive(),
      nomeCompleto: z.string(),
      parentescoId: z.number().int().positive(),
    }),
    404: notFoundRequestSchema,
  },
};

export const getResponsavelSchema = {
  summary: 'Busca responsavel pelo id',
  tags: ['responsaveis'],
  params: responsavelParamsSchema,
  response: {
    200: z.object({
      id: z.number().int().positive(),
      nomeCompleto: z.string(),
      parentesco: z.string(),
      endereco: z.object({
        bairro: z.string(),
        rua: z.string(),
        numeroCasa: z.string(),
      }),
      contacto: z.object({
        telefone: z.string(),
        email: z.string().email().nullable(),
        outros: z.string().nullable(),
      }),
    }),
    404: notFoundRequestSchema,
  },
};

export type uniqueResponsavelResourceParamsType = z.infer<
  typeof responsavelParamsSchema
>;
export type createResponsavelBodyType = z.infer<
  typeof createResponsavelBodySchema
>;
