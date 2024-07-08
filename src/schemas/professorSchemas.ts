import { z } from 'zod';
import {
  FULL_NAME_REGEX,
  OUTROS_CONTACTOS_REGEX,
} from '../utils/regexPatterns';
import { contactoSchema } from './contactoSchema';
import {
  complexBadRequestSchema,
  getAllResourcesParamsSchema,
  notFoundRequestSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const professorBodySchema = z
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
    dataNascimento: z
      .string({ required_error: 'A data de nascimento é obrigatória.' })
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
  })
  .merge(contactoSchema)
  .extend({
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
  });

const professorParamsSchema = z.object({
  professorId: z.coerce
    .number({
      required_error: 'O id do responsavel é obrigatório.',
      invalid_type_error: 'O id do responsavel deve ser número.',
    })
    .int({ message: 'O id do responsavel deve ser inteiro.' })
    .positive({ message: 'O id do responsavel deve ser positivo.' }),
});

const professorOkResponseSchema = z.object({
  id: z.number().int().positive(),
  nomeCompleto: z.string(),
  dataNascimento: z.string().date(),
});

const professorDisciplinasAssociationSchema = {
  tags: ['professores'],
  params: professorParamsSchema,
  body: z.object({
    disciplinas: z
      .array(
        z
          .number({
            message: 'O array de disciplinas deve conter apenas números.',
          })
          .int({
            message:
              'O array de disciplinas deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de disciplinas deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'As disciplinas devem ser  enviadas no formato de array.',
        }
      )
      .nonempty({ message: 'O array de disciplinas não deve estar vazio.' }),
  }),
  response: {
    200: professorOkResponseSchema.omit({ id: true }).extend({
      disciplinas: z.array(z.number().int().positive()).optional(),
    }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema.or(notFoundRequestSchema),
  },
};

export const createProfessorSchema = {
  summary: 'Adiciona um novo professor',
  tags: ['professores'],
  body: professorBodySchema.extend({
    disciplinas: z
      .array(
        z
          .number({
            message: 'O array de disciplinas deve conter apenas números.',
          })
          .int({
            message:
              'O array de disciplinas deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de disciplinas deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'As disciplinas devem ser  enviadas no formato de array.',
        }
      )
      .optional(),
  }),
  response: {
    201: professorOkResponseSchema.extend({
      disciplinas: z.array(z.number().int().positive()).optional(),
    }),
    400: simpleBadRequestSchema,
  },
};

export const updateProfessorSchema = {
  summary: 'Atualiza um professor existente',
  tags: ['professores'],
  params: professorParamsSchema,
  body: professorBodySchema,
  response: {
    200: professorOkResponseSchema.omit({ id: true }),
    400: simpleBadRequestSchema,
    404: notFoundRequestSchema,
  },
};

export const getProfessorSchema = {
  summary: 'Busca um professor pelo id',
  tags: ['professores'],
  params: professorParamsSchema,
  response: {
    200: professorOkResponseSchema.extend({
      contacto: z.object({
        telefone: z.string(),
        email: z.string().email().nullable(),
        outros: z.string().nullable(),
      }),
    }),
    404: notFoundRequestSchema,
  },
};

export const getProfessoresSchema = {
  summary: 'Retorna todos os professores',
  tags: ['professores'],
  querystring: getAllResourcesParamsSchema,
  response: {
    200: z.object({
      data: z.array(professorOkResponseSchema),
      next_cursor: z.number().optional(),
    }),
  },
};

export const createProfessorDisciplinasAssociationSchema = {
  summary: 'Associa Múltiplas disciplinas à um professor',
  ...professorDisciplinasAssociationSchema,
};

export type uniqueProfessorResourceParamsType = z.infer<
  typeof professorParamsSchema
>;
export type professorBodyType = z.infer<typeof createProfessorSchema.body>;

export type getProfessoresQueryStringType = z.infer<
  typeof getProfessoresSchema.querystring
>;

export type professorDisciplinasAssociationBodyType = z.infer<
  typeof createProfessorDisciplinasAssociationSchema.body
>;
