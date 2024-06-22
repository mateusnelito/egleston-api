import { z } from 'zod';
import {
  complexBadRequestSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const FULL_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
const OUTROS_CONTACTOS_REGEX = /^[a-zA-ZÀ-ÿ0-9.,;:'"\-\(\)\s]{5,255}$/;

export const createAlunoSchema = {
  summary: 'Adiciona um novo aluno',
  tags: ['alunos'],
  body: z.object({
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
    numeroBi: z
      .string({
        required_error: 'O número de BI é obrigatório.',
        invalid_type_error: 'O número de BI deve ser uma string.',
      })
      .trim()
      .length(14, { message: 'O número de BI deve possuir 14 caracteres.' })
      .regex(/^\d{9}[A-Z]{2}\d{3}$/, { message: 'O número de BI é inválido.' }),
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
      .refine((date) => date <= new Date(), {
        message: 'A data de nascimento não pode estar no futuro.',
      }),
    genero: z.enum(['M', 'F'], { message: 'O género deve ser "M" ou "F".' }),
    bairro: z
      .string({
        required_error: 'O nome do bairro é obrigatório.',
        invalid_type_error: 'O nome do bairro deve ser uma string.',
      })
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9.,;'"-\s]{2,29}$/, {
        message:
          'O nome do bairro deve possuir entre 3 e 30 caracteres, começar com uma letra e incluir apenas caracteres especiais necessários.',
      }),
    rua: z
      .string({
        required_error: 'O nome da rua é obrigatório.',
        invalid_type_error: 'O nome da rua deve ser uma string.',
      })
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9.,;'"()\s-]{2,49}$/, {
        message:
          'O nome da rua deve ter entre 3 e 50 caracteres, começar com uma letra ou número, e pode incluir apenas letras, números, espaços e os caracteres especiais permitidos (,.;\'"-()).',
      }),
    numeroCasa: z
      .number({
        required_error: 'O número da casa é obrigatório.',
        invalid_type_error: 'O número da casa deve ser um número.',
      })
      .int({ message: 'O número da casa deve ser inteiro.' })
      .positive({ message: 'O número da casa deve ser positivo.' })
      .max(99999, { message: 'O número da casa máximo valido é 99999.' })
      .transform(String),
    telefone: z
      .string({
        required_error: 'O número de telefone é obrigatório.',
        invalid_type_error: 'O número de telefone deve ser uma string.',
      })
      .trim()
      .regex(/99|9[1-5]\d{7}$/gm, {
        message: 'O número de telefone é inválido.',
      }),
    email: z
      .string({
        required_error: 'O endereço de email é obrigatório.',
        invalid_type_error: 'O endereço de email deve ser uma string.',
      })
      .trim()
      .email({ message: 'O endereço de email é inválido.' })
      .optional(),
    responsaveis: z.array(
      z.object({
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
        bairro: z
          .string({
            required_error: 'O nome do bairro é obrigatório.',
            invalid_type_error: 'O nome do bairro deve ser uma string.',
          })
          .trim()
          .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9.,;'"-\s]{2,29}$/, {
            message:
              'O nome do bairro deve possuir entre 3 e 30 caracteres, começar com uma letra e incluir apenas caracteres especiais necessários.',
          }),
        rua: z
          .string({
            required_error: 'O nome da rua é obrigatório.',
            invalid_type_error: 'O nome da rua deve ser uma string.',
          })
          .trim()
          .regex(/^[a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9.,;'"()\s-]{2,49}$/, {
            message:
              'O nome da rua deve ter entre 3 e 50 caracteres, começar com uma letra ou número, e pode incluir apenas letras, números, espaços e os caracteres especiais permitidos (,.;\'"-()).',
          }),
        numeroCasa: z
          .number({
            required_error: 'O número da casa é obrigatório.',
            invalid_type_error: 'O número da casa deve ser um número.',
          })
          .int({ message: 'O número da casa deve ser inteiro.' })
          .positive({ message: 'O número da casa deve ser positivo.' })
          .max(99999, { message: 'O número da casa máximo valido é 99999.' })
          .transform(String),
        telefone: z
          .string({
            required_error: 'O número de telefone é obrigatório.',
            invalid_type_error: 'O número de telefone deve ser uma string.',
          })
          .trim()
          .regex(/99|9[1-5]\d{7}$/gm, {
            message: 'O número de telefone é inválido.',
          }),
        email: z
          .string({
            invalid_type_error: 'O endereço de email deve ser uma string.',
          })
          .trim()
          .email({ message: 'O endereço de email é inválido.' })
          .optional(),
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
      {
        invalid_type_error: 'O array de responsáveis é inválido.',
        required_error: 'Os responsaveis são obrigatórios.',
      }
    ),
  }),
  response: {
    // 201: z.object({
    //   id: z.number().int().positive(),
    //   nomeCompleto: z.string(),
    //   nomeCompletoPai: z.string(),
    //   nomeCompletoMae: z.string(),
    //   numeroBi: z.string(),
    //   dataNascimento: z.date(),
    //   genero: z.enum(['M', 'F']),
    // }),
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
  body: z.object({
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
      .refine((date) => date <= new Date(), {
        message: 'A data de nascimento não pode estar no futuro.',
      }),
    genero: z.enum(['M', 'F'], { message: 'O género deve ser "M" ou "F".' }),
    bairro: z
      .string({
        required_error: 'O nome do bairro é obrigatório.',
        invalid_type_error: 'O nome do bairro deve ser uma string.',
      })
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9.,;'"-\s]{2,29}$/, {
        message:
          'O nome do bairro deve possuir entre 3 e 30 caracteres, começar com uma letra e incluir apenas caracteres especiais necessários.',
      }),
    rua: z
      .string({
        required_error: 'O nome da rua é obrigatório.',
        invalid_type_error: 'O nome da rua deve ser uma string.',
      })
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9.,;'"()\s-]{2,49}$/, {
        message:
          'O nome da rua deve ter entre 3 e 50 caracteres, começar com uma letra ou número, e pode incluir apenas letras, números, espaços e os caracteres especiais permitidos (,.;\'"-()).',
      }),
    numeroCasa: z
      .number({
        required_error: 'O número da casa é obrigatório.',
        invalid_type_error: 'O número da casa deve ser um número.',
      })
      .int({ message: 'O número da casa deve ser inteiro.' })
      .positive({ message: 'O número da casa deve ser positivo.' })
      .max(99999, { message: 'O número da casa máximo valido é 99999.' })
      .transform(String),
    telefone: z
      .string({
        required_error: 'O número de telefone é obrigatório.',
        invalid_type_error: 'O número de telefone deve ser uma string.',
      })
      .trim()
      .regex(/99|9[1-5]\d{7}$/gm, {
        message: 'O número de telefone é inválido.',
      }),
    email: z
      .string({
        required_error: 'O endereço de email é obrigatório.',
        invalid_type_error: 'O endereço de email deve ser uma string.',
      })
      .trim()
      .email({ message: 'O endereço de email é inválido.' }),
  }),
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
