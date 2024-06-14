import { z } from 'zod';

const FULL_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

export const createAlunoSchema = {
  summary: 'Cria um aluno',
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
  }),
  response: {
    201: z.object({
      id: z.number().int().positive(),
    }),
  },
};

// Extract the TS type from createAlunoSchema
export type CreateAlunoBodyType = z.infer<typeof createAlunoSchema.body>;
