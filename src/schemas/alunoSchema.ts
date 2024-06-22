import { z } from 'zod';
import {
  complexBadRequestSchema,
  getAllResourcesParamsSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';
import { FULL_NAME_REGEX } from '../utils/regexPatterns';
import { enderecoSchema } from './enderecoSchema';
import { contactoSchema } from './contactoSchema';
import { createResponsavelBodySchema } from './responsavelSchema';

const ALUNO_BODY_SCHEMA = z
  .object({
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
    nomeCompletoPai: z
      .string({
        required_error: 'O nome completo do pai é obrigatório.',
        invalid_type_error: 'O nome completo do pai deve ser uma string.',
      })
      .trim()
      .min(10, {
        message: 'O nome completo do pai deve possuir no mínimo 10 caracteres.',
      })
      .max(100, {
        message:
          'O nome completo do pai deve possuir no máximo 100 caracteres.',
      })
      .regex(FULL_NAME_REGEX, {
        message:
          'O nome completo do pai deve possuir apenas caracteres alfabéticos e espaços.',
      }),
    nomeCompletoMae: z
      .string({
        required_error: 'O nome completo da mãe é obrigatório.',
        invalid_type_error: 'O nome completo da mãe deve ser uma string.',
      })
      .trim()
      .min(10, {
        message: 'O nome completo da mãe deve possuir no mínimo 10 caracteres.',
      })
      .max(100, {
        message:
          'O nome completo da mãe deve possuir no máximo 100 caracteres.',
      })
      .regex(FULL_NAME_REGEX, {
        message:
          'O nome completo da mãe deve possuir apenas caracteres alfabéticos e espaços.',
      }),
    dataNascimento: z
      .string()
      .trim()
      .date(
        'A data de nascimento deve ser uma data válida no formato AAAA-MM-DD.'
      )
      .transform((date) => new Date(date))
      // FIXME: Change the bases date to a dynamic logic
      .refine((date) => date >= new Date('1900-01-01'), {
        message:
          'A data de nascimento não pode ser anterior a 1 de janeiro de 1900.',
      })
      .refine((date) => date <= new Date(Date.now()), {
        message: 'A data de nascimento não pode estar no futuro.',
      }),
    genero: z.enum(['M', 'F'], { message: 'O género deve ser "M" ou "F".' }),
  })
  .merge(enderecoSchema)
  .merge(contactoSchema);

export const createAlunoSchema = {
  summary: 'Adiciona um novo aluno',
  tags: ['alunos'],
  body: ALUNO_BODY_SCHEMA.merge(
    z.object({
      numeroBi: z
        .string({
          required_error: 'O número de BI é obrigatório.',
          invalid_type_error: 'O número de BI deve ser uma string.',
        })
        .trim()
        .length(14, { message: 'O número de BI deve possuir 14 caracteres.' })
        .regex(/^\d{9}[A-Z]{2}\d{3}$/, {
          message: 'O número de BI é inválido.',
        }),
      responsaveis: z.array(createResponsavelBodySchema, {
        invalid_type_error: 'O array de responsáveis é inválido.',
        required_error: 'Os responsaveis são obrigatórios.',
      }),
    })
  ),
  response: {
    201: z.object({
      id: z.number().int().positive(),
      nomeCompleto: z.string(),
      nomeCompletoPai: z.string(),
      nomeCompletoMae: z.string(),
      numeroBi: z.string(),
      dataNascimento: z.date(),
      genero: z.enum(['M', 'F']),
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const updateAlunoSchema = {
  summary: 'Atualiza um aluno existente',
  tags: ['alunos'],
  params: z.object({
    alunoId: z.coerce
      .number({
        required_error: 'O id do aluno é obrigatório.',
        invalid_type_error: 'O id do aluno deve ser número.',
      })
      .int({ message: 'O id do aluno deve ser inteiro.' })
      .positive({ message: 'O id do aluno deve ser positivo.' }),
  }),
  body: ALUNO_BODY_SCHEMA,
  response: {
    200: z.object({
      nomeCompleto: z.string(),
      nomeCompletoPai: z.string(),
      nomeCompletoMae: z.string(),
      dataNascimento: z.date(),
      genero: z.enum(['M', 'F']),
    }),
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getAlunosSchema = {
  summary: 'Retorna todos os alunos',
  tags: ['alunos'],
  querystring: getAllResourcesParamsSchema,
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number().int().positive(),
          nomeCompleto: z.string(),
          numeroBi: z.string(),
          dataNascimento: z.date(),
          genero: z.enum(['M', 'F']),
        })
      ),
      next_cursor: z.number().int().optional(),
    }),
  },
};

export const getAlunoSchema = {
  summary: 'Busca aluno pelo Id',
  tags: ['alunos'],
  params: z.object({
    alunoId: z.coerce
      .number({
        required_error: 'O id do aluno é obrigatório.',
        invalid_type_error: 'O id do aluno deve ser número.',
      })
      .int({ message: 'O id do aluno deve ser inteiro.' })
      .positive({ message: 'O id do aluno deve ser positivo.' }),
  }),
  response: {
    200: z.object({
      id: z.number().int().positive(),
      nomeCompleto: z.string(),
      nomeCompletoPai: z.string(),
      nomeCompletoMae: z.string(),
      numeroBi: z.string(),
      dataNascimento: z.date(),
      genero: z.enum(['M', 'F']),
      bairro: z.string(),
      rua: z.string(),
      numeroCasa: z.string(),
      telefone: z.string(),
      email: z.string(),
    }),
    404: notFoundRequestSchema,
  },
};

// Extract the TS types from Schemas
export type CreateAlunoBodyType = z.infer<typeof createAlunoSchema.body>;
export type updateAlunoBodyType = z.infer<typeof updateAlunoSchema.body>;
export type uniqueAlunoResourceParamsType = z.infer<
  typeof updateAlunoSchema.params
>;
export type getAlunosQueryStringType = z.infer<
  typeof getAlunosSchema.querystring
>;

export type badRequestErrorsResponse = z.infer<
  (typeof createAlunoSchema.response)[400]
>;
