import { z } from 'zod';
import {
  FULL_NAME_REGEX,
  OUTROS_CONTACTOS_REGEX,
} from '../utils/regexPatterns';
import { enderecoSchema } from './enderecoSchema';
import { contactoSchema } from './contactoSchema';

const responsavelBodySchema = z
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
    parentescoId: z.coerce
      .number({
        required_error: 'O id de parentesco é obrigatório.',
        invalid_type_error: 'O id do parentesco deve ser número.',
      })
      .int({ message: 'O id do parentesco deve ser inteiro.' })
      .positive({ message: 'O id do parentesco deve ser positivo.' }),
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
  })
  .merge(enderecoSchema)
  .merge(contactoSchema);

const responsavelParamsSchema = z.object({
  responsavelId: z.coerce
    .number({
      required_error: 'O id do responsavel é obrigatório.',
      invalid_type_error: 'O id do responsavel deve ser número.',
    })
    .int({ message: 'O id do responsavel deve ser inteiro.' })
    .positive({ message: 'O id do responsavel deve ser positivo.' }),
});

export const createResponsavelSchema = {
  summary: 'Adiciona um novo responsavel para um aluno especifico',
  tags: ['responsaveis'],
  params: z.object({
    alunoId: z.coerce
      .number({
        required_error: 'O id do aluno é obrigatório.',
        invalid_type_error: 'O id do aluno deve ser número.',
      })
      .int({ message: 'O id do aluno deve ser inteiro.' })
      .positive({ message: 'O id do aluno deve ser positivo.' }),
  }),
  body: responsavelBodySchema,
  response: {
    201: z.object({
      id: z.number().int().positive(),
      nomeCompleto: z.string(),
    }),
  },
};

export const updateResponsavelSchema = {
  summary: 'Atualiza um responsavel existente',
  tags: ['responsaveis'],
  params: responsavelParamsSchema,
  body: responsavelBodySchema,
  response: {
    // 201: z.object({
    //   id: z.number().int().positive(),
    //   nomeCompleto: z.string(),
    // }),
  },
};

export const createResponsavelBodySchema = createResponsavelSchema.body;
export type responsavelBodyType = z.infer<typeof createResponsavelSchema.body>;
export type createResponsavelParamsType = z.infer<
  typeof createResponsavelSchema.params
>;
export type uniqueResponsavelResourceParamsType = z.infer<
  typeof responsavelParamsSchema
>;
