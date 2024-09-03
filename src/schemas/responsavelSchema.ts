import { z } from 'zod';
import { fullNameRegEx } from '../utils/regexPatterns';
import { contactoSchema } from './contactoSchema';
import { enderecoSchema } from './enderecoSchema';
import {
  complexBadRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

export const responsavelBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do responsavel é obrigatório.',
      invalid_type_error: 'O id do responsavel deve ser número.',
    })
    .int({ message: 'O id do responsavel deve ser inteiro.' })
    .positive({ message: 'O id do responsavel deve ser positivo.' }),
  alunoId: z
    .number({
      required_error: 'O id do aluno é obrigatório.',
      invalid_type_error: 'O id do aluno deve ser número.',
    })
    .int({ message: 'O id do aluno deve ser inteiro.' })
    .positive({ message: 'O id do aluno deve ser positivo.' }),
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
    .regex(fullNameRegEx, {
      message:
        'O nome completo deve possuir apenas caracteres alfabéticos e espaços.',
    }),
  parentescoId: z
    .number({
      required_error: 'O id de parentesco é obrigatório.',
      invalid_type_error: 'O id do parentesco deve ser número.',
    })
    .int({ message: 'O id do parentesco deve ser inteiro.' })
    .positive({ message: 'O id do parentesco deve ser positivo.' }),
});

export const createResponsavelBodySchema = responsavelBodySchema
  .omit({ id: true, alunoId: true })
  .extend({
    endereco: enderecoSchema,
    contacto: contactoSchema,
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
  body: createResponsavelBodySchema,
  response: {
    200: responsavelBodySchema
      .omit({ alunoId: true, parentescoId: true })
      .extend({
        parentesco: z.string(),
        endereco: enderecoSchema.extend({
          numeroCasa: z.string(),
        }),
        contacto: contactoSchema,
      }),
    400: complexBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const deleteResponsavelSchema = {
  summary: 'Deleta um responsavel existente',
  tags: ['responsaveis'],
  params: responsavelParamsSchema,
  response: {
    200: responsavelBodySchema
      .omit({ parentescoId: true, alunoId: true })
      .extend({
        parentesco: z.string(),
        endereco: enderecoSchema.extend({
          numeroCasa: z.string(),
        }),
        contacto: contactoSchema,
      }),
    404: simpleBadRequestSchema,
  },
};

export const getResponsavelSchema = {
  summary: 'Busca responsavel pelo id',
  tags: ['responsaveis'],
  params: responsavelParamsSchema,
  response: {
    200: responsavelBodySchema
      .omit({ parentescoId: true, alunoId: true })
      .extend({
        parentesco: z.string(),
        endereco: enderecoSchema.extend({
          numeroCasa: z.string(),
        }),
        contacto: contactoSchema,
      }),
    404: simpleBadRequestSchema,
  },
};

export type responsavelParamsType = z.infer<typeof responsavelParamsSchema>;
export type createResponsavelBodyType = z.infer<
  typeof createResponsavelBodySchema
>;
