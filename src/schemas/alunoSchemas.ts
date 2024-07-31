import { z } from 'zod';
import { FULL_NAME_REGEX, NUMERO_BI_REGEX } from '../utils/regexPatterns';
import { contactoSchema } from './contactoSchema';
import { enderecoSchema } from './enderecoSchema';
import {
  complexBadRequestSchema,
  getAllResourcesParamsSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';
import {
  createResponsavelBodySchema,
  responsavelBodySchema,
} from './responsavelSchema';

const alunoBodySchema = z.object({
  id: z
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
      message: 'O nome completo do pai deve possuir no máximo 100 caracteres.',
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
      message: 'O nome completo da mãe deve possuir no máximo 100 caracteres.',
    })
    .regex(FULL_NAME_REGEX, {
      message:
        'O nome completo da mãe deve possuir apenas caracteres alfabéticos e espaços.',
    }),
  numeroBi: z
    .string({
      required_error: 'O número de BI é obrigatório.',
      invalid_type_error: 'O número de BI deve ser uma string.',
    })
    .trim()
    .length(14, { message: 'O número de BI deve possuir 14 caracteres.' })
    .regex(NUMERO_BI_REGEX, {
      message: 'O número de BI é inválido.',
    }),
  dataNascimento: z
    .string({ required_error: 'A data de nascimento é obrigatória.' })
    .trim()
    .date('A data de nascimento inválida.'),
  genero: z.enum(['M', 'F'], { message: 'O género deve ser "M" ou "F".' }),
});

const alunoParamsSchema = z.object({
  alunoId: z.coerce
    .number({
      required_error: 'O id do aluno é obrigatório.',
      invalid_type_error: 'O id do aluno deve ser número.',
    })
    .int({ message: 'O id do aluno deve ser inteiro.' })
    .positive({ message: 'O id do aluno deve ser positivo.' }),
});

export const createAlunoSchema = {
  summary: 'Adiciona um novo aluno',
  tags: ['alunos'],
  body: alunoBodySchema.omit({ id: true }).extend({
    endereco: enderecoSchema,
    contacto: contactoSchema,
    responsaveis: z.array(createResponsavelBodySchema, {
      invalid_type_error: 'O array de responsáveis é inválido.',
      required_error: 'Os responsaveis são obrigatórios.',
    }),
  }),
  response: {
    201: alunoBodySchema.extend({
      endereco: enderecoSchema
        .omit({ numeroCasa: true })
        .extend({ numeroCasa: z.string().transform(Number) }),
      contacto: contactoSchema,
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const updateAlunoSchema = {
  summary: 'Atualiza um aluno existente',
  tags: ['alunos'],
  params: alunoParamsSchema,
  body: alunoBodySchema.omit({ id: true, numeroBi: true }).extend({
    endereco: enderecoSchema,
    contacto: contactoSchema,
  }),
  response: {
    200: alunoBodySchema.omit({ numeroBi: true }).extend({
      endereco: enderecoSchema
        .omit({ numeroCasa: true })
        .extend({ numeroCasa: z.string().transform(Number) }),
      contacto: contactoSchema,
    }),
    400: complexBadRequestSchema,
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
        alunoBodySchema.omit({
          nomeCompletoPai: true,
          nomeCompletoMae: true,
        })
      ),
      next_cursor: z.number().int().optional(),
    }),
  },
};

export const getAlunoSchema = {
  summary: 'Busca aluno pelo Id',
  tags: ['alunos'],
  params: alunoParamsSchema,
  response: {
    200: alunoBodySchema.extend({
      endereco: enderecoSchema
        .omit({ numeroCasa: true })
        .extend({ numeroCasa: z.string().transform(Number) }),
      contacto: contactoSchema,
      responsaveis: z.array(
        responsavelBodySchema
          .omit({ parentescoId: true })
          .extend({ parentesco: z.string() }),
        {
          invalid_type_error: 'O array de responsáveis é inválido.',
          required_error: 'Os responsaveis são obrigatórios.',
        }
      ),
    }),
    404: notFoundRequestSchema,
  },
};

export const getAlunoResponsaveisSchema = {
  summary: 'Retorna todos os responsaveis do aluno',
  tags: ['alunos'],
  params: alunoParamsSchema,
  response: {
    200: z.object({
      data: z.array(
        z.object({
          id: z.number().int().int().positive(),
          nomeCompleto: z.string(),
        })
      ),
    }),
    404: notFoundRequestSchema,
  },
};

export type storeAlunoBodyType = z.infer<typeof createAlunoSchema.body>;
export type updateAlunoBodyType = z.infer<typeof updateAlunoSchema.body>;
export type alunoParamsSchema = z.infer<typeof alunoParamsSchema>;
export type getAlunosQueryStringType = z.infer<
  typeof getAlunosSchema.querystring
>;
