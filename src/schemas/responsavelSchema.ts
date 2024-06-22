import { z } from 'zod';
import {
  FULL_NAME_REGEX,
  OUTROS_CONTACTOS_REGEX,
} from '../utils/regexPatterns';
import { enderecoSchema } from './enderecoSchema';
import { contactoSchema } from './contactoSchema';
export const createResponsavelSchema = {
  summary: 'Adiciona um novo responsavel para um aluno especifico',
  tags: ['responsaveis'],
  body: z
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
    .merge(contactoSchema),
};
export const createResponsavelBodySchema = createResponsavelSchema.body;
