import { z } from 'zod';
import { fullNameRegEx, numeroBiRegEx } from '../utils/regexPatterns';
import { contactoSchema } from './contactoSchema';
import { enderecoSchema } from './enderecoSchema';
import {
  complexBadRequestSchema,
  getResourcesDefaultQueriesSchema,
  notFoundRequestSchema,
} from './globalSchema';
import { createResponsavelBodySchema } from './responsavelSchema';

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
    .regex(fullNameRegEx, {
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
    .regex(fullNameRegEx, {
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
    .regex(fullNameRegEx, {
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
    .regex(numeroBiRegEx, {
      message: 'O número de BI é inválido.',
    }),
  dataNascimento: z
    .string({ required_error: 'A data de nascimento é obrigatória.' })
    .trim()
    .date('A data de nascimento inválida.')
    .transform((birthDate) => new Date(birthDate)),
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
  summary: 'Cria um novo aluno',
  tags: ['alunos'],
  body: alunoBodySchema.omit({ id: true }).extend({
    endereco: enderecoSchema,
    contacto: contactoSchema.omit({ outros: true }),
    responsaveis: z
      .array(createResponsavelBodySchema, {
        invalid_type_error: 'O array de responsáveis é inválido.',
        required_error: 'Os responsaveis são obrigatórios.',
      })
      .max(4, { message: 'O número máximo de responsaveis é 4.' })
      .nonempty({ message: 'Os responsaveis devem ser enviados.' }),
  }),
  response: {
    201: alunoBodySchema.extend({
      dataNascimento: z.string().date(),
      endereco: enderecoSchema.extend({
        numeroCasa: z.string(),
      }),
      contacto: contactoSchema.omit({ outros: true }),
      responsaveis: z.number().int(),
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
    contacto: contactoSchema.omit({ outros: true }),
  }),
  response: {
    200: alunoBodySchema.omit({ numeroBi: true }).extend({
      dataNascimento: z.string().date(),
      endereco: enderecoSchema.extend({ numeroCasa: z.string() }),
      contacto: contactoSchema.omit({ outros: true }),
    }),
    400: complexBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getAlunosSchema = {
  summary: 'Retorna todos os alunos',
  tags: ['alunos'],
  querystring: getResourcesDefaultQueriesSchema,
  response: {
    200: z.object({
      data: z.array(
        alunoBodySchema
          .extend({
            dataNascimento: z.string().date(),
          })
          .omit({
            nomeCompletoPai: true,
            nomeCompletoMae: true,
          })
      ),
      next_cursor: z.number().int().optional(),
    }),
  },
};

export const getAlunoSchema = {
  summary: 'Retorna um aluno',
  tags: ['alunos'],
  params: alunoParamsSchema,
  response: {
    200: alunoBodySchema.extend({
      dataNascimento: z.string().date(),
      endereco: enderecoSchema.extend({ numeroCasa: z.string() }),
      contacto: contactoSchema.omit({ outros: true }),
      responsaveis: z.number().int(),
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

export const createAlunoResponsavelSchema = {
  summary: 'Adiciona um novo responsavel para um aluno',
  tags: ['alunos'],
  params: alunoParamsSchema,
  body: createResponsavelBodySchema,
  response: {
    // TODO: SEND A BETTER RESPONSE
    // 201: z.object({
    //   id: z.number().int().positive(),
    //   nomeCompleto: z.string(),
    // }),
    400: complexBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export type createAlunoBodyType = z.infer<typeof createAlunoSchema.body>;
export type updateAlunoBodyType = z.infer<typeof updateAlunoSchema.body>;
export type alunoParamsSchema = z.infer<typeof alunoParamsSchema>;
export type getAlunosQueryStringType = z.infer<
  typeof getAlunosSchema.querystring
>;
