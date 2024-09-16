import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';

const trimestreBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do trimestre é obrigatório.',
      invalid_type_error: 'O id do trimestre deve ser número.',
    })
    .int({ message: 'O id do trimestre deve ser inteiro.' })
    .positive({ message: 'O id do trimestre deve ser positivo.' }),
  anoLectivoId: z
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
  numero: z
    .number({
      required_error: 'O número do trimestre é obrigatório.',
      invalid_type_error: 'O número do trimestre deve ser um número.',
    })
    .int({ message: 'O número do trimestre deve ser inteiro.' })
    .positive({ message: 'O número do trimestre deve ser positivo.' })
    .max(3, { message: 'O número do trimestre máximo valido é 3.' }),
  inicio: z
    .string({
      required_error: 'O inicio do trimestre é obrigatório.',
      invalid_type_error: 'O inicio do trimestre deve ser uma data.',
    })
    .trim()
    .date('O inicio deve ser uma data válida.')
    .transform((inicio) => new Date(inicio)),
  termino: z
    .string({
      required_error: 'O termino do trimestre é obrigatório.',
      invalid_type_error: 'O termino do trimestre deve ser uma data.',
    })
    .trim()
    .date('O termino deve ser uma data válida.')
    .transform((termino) => new Date(termino)),
});

const trimestreParamsSchema = z.object({
  trimestreId: z.coerce
    .number({
      required_error: 'O id do trimestre é obrigatório.',
      invalid_type_error: 'O id do trimestre deve ser número.',
    })
    .int({ message: 'O id do trimestre deve ser inteiro.' })
    .positive({ message: 'O id do trimestre deve ser positivo.' }),
});

export const createTrimestreSchema = {
  summary: 'Adiciona um trimestre para o ano-lectivo corrente',
  tags: ['trimestres'],
  body: trimestreBodySchema.omit({ id: true, anoLectivoId: true }),
  response: {
    201: trimestreBodySchema.omit({ anoLectivoId: true }).extend({
      anoLectivo: z.object({
        id: z.number(),
        nome: z.string(),
      }),
      inicio: z.string().date(),
      termino: z.string().date(),
    }),
    404: simpleBadRequestSchema,
    400: simpleBadRequestSchema,
  },
};

export const getTrimestresSchema = {
  summary: 'Retorna todos os anos trimestres do ano-lectivo activo',
  tags: ['trimestres'],
  response: {
    200: z.object({
      data: z.array(
        trimestreBodySchema
          .omit({
            anoLectivoId: true,
          })
          .extend({
            inicio: z.string().date(),
            termino: z.string().date(),
          })
      ),
    }),
  },
};

export const getTrimestreSchema = {
  summary: 'Retorna detalhes de um trimestre',
  params: trimestreParamsSchema,
  tags: ['trimestres'],
  response: {
    200: trimestreBodySchema.omit({ anoLectivoId: true }).extend({
      anoLectivo: z.object({
        id: z.number(),
        nome: z.string(),
      }),
      inicio: z.string().date(),
      termino: z.string().date(),
    }),
    404: simpleBadRequestSchema,
    400: simpleBadRequestSchema,
  },
};

export type createTrimestreBodyType = z.infer<
  typeof createTrimestreSchema.body
>;
export type trimestreParamsType = z.infer<typeof trimestreParamsSchema>;
