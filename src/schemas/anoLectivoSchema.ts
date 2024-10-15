import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';
import { classeBodySchema } from './classeSchemas';
import { trimestreBodySchema } from './trimestreSchemas';

const anoLectivoBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
  nome: z
    .string({
      required_error: 'O nome do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .trim()
    .min(4, {
      message: 'O nome do ano lectivo deve possuir no mínimo 4 caracteres.',
    })
    .max(10, {
      message: 'O nome do ano lectivo deve possuir no máximo 10 caracteres.',
    })
    .regex(/^\d{4}-\d{4}$/, {
      message: 'o nome do ano lectivo deve seguir o padrão 9999-9999.',
    }),
  inicio: z
    .string({
      required_error: 'O inicio do ano lectivo é obrigatório.',
      invalid_type_error: 'O inicio do ano lectivo deve ser uma data.',
    })
    .trim()
    .date('O inicio deve ser uma data válida.'),
  termino: z
    .string({
      required_error: 'O termino do ano lectivo é obrigatório.',
      invalid_type_error: 'O termino do ano lectivo deve ser uma data.',
    })
    .trim()
    .date('O termino deve ser uma data válida.'),
  activo: z.boolean({
    required_error: 'O status do ano lectivo é obrigatório.',
    invalid_type_error: 'O status do ano lectivo deve ser boolean.',
  }),
});

const anoLectivoParamsSchema = z.object({
  anoLectivoId: z.coerce
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
});

export const createAnoLectivoSchema = {
  summary: 'Adiciona um ano lectivo ',
  tags: ['ano-lectivo'],
  body: anoLectivoBodySchema.omit({ id: true, nome: true, activo: true }),
  response: {
    201: anoLectivoBodySchema,
    400: simpleBadRequestSchema,
  },
};

export const updateAnoLectivoSchema = {
  summary: 'Atualiza um ano lectivo existente',
  tags: ['ano-lectivo'],
  params: anoLectivoParamsSchema,
  body: anoLectivoBodySchema.omit({ id: true, nome: true, activo: true }),
  response: {
    200: anoLectivoBodySchema,
    404: simpleBadRequestSchema,
    400: simpleBadRequestSchema,
  },
};

export const changeAnoLectivoStatusSchema = {
  summary: 'Altera o status do ano lectivo actual',
  tags: ['ano-lectivo'],
  body: anoLectivoBodySchema.omit({
    id: true,
    nome: true,
    inicio: true,
    termino: true,
  }),
  response: {
    // 200: anoLectivoBodySchema,
    404: simpleBadRequestSchema,
    400: simpleBadRequestSchema,
  },
};

export const getAnoLectivosSchema = {
  summary: 'Retorna todos os anos lectivos',
  tags: ['ano-lectivo'],
  response: {
    200: z.object({
      data: z.array(anoLectivoBodySchema.omit({ inicio: true, termino: true })),
    }),
  },
};

export const getAnoLectivoSchema = {
  summary: 'Retorna um ano lectivo',
  tags: ['ano-lectivo'],
  params: anoLectivoParamsSchema,
  response: {
    200: anoLectivoBodySchema,
    404: simpleBadRequestSchema,
  },
};

export const getAnoLectivoClassesSchema = {
  summary: 'Retorna todas as classes do ano',
  tags: ['ano-lectivo'],
  params: anoLectivoParamsSchema,
  response: {
    200: z.object({
      data: z.object({
        cursos: z.record(
          z.string(),
          z.object({
            nome: z.string(),
            classes: z.array(
              z.object({
                id: z.number().int().positive(),
                nome: z.string(),
              })
            ),
          })
        ),
      }),
      // data: z.array(
      //   z.object({
      //     id: z.number().int().positive(),
      //     nome: z.string(),
      //   })
      // ),
    }),
    404: simpleBadRequestSchema,
  },
};

export const createClasseToAnoLectivoSchema = {
  summary: 'Adiciona uma classe ao ano lectivo',
  tags: ['ano-lectivo'],
  params: anoLectivoParamsSchema,
  body: classeBodySchema.omit({ id: true }),
  response: {
    201: classeBodySchema.extend({
      valorMatricula: z.coerce.number(),
    }),
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getAnoLectivoTrimestresSchema = {
  summary: 'Retorna todos os trimestres do ano-lectivo',
  tags: ['ano-lectivo'],
  params: anoLectivoParamsSchema,
  response: {
    200: z.object({
      // TODO: REFACTOR THIS CODE TO OWN SCHEMA
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
    404: simpleBadRequestSchema,
  },
};

export const changeAnoLectivoMatriculaAbertaSchema = {
  summary: 'Altera o status da matricula do ano lectivo actual',
  tags: ['ano-lectivo'],
  params: anoLectivoParamsSchema,
  body: z.object({
    matriculaAberta: z.boolean({
      required_error: 'O status de matricula aberta é obrigatório.',
      invalid_type_error: 'O status de matricula aberta deve ser boolean.',
    }),
  }),
  response: {
    // 200: anoLectivoBodySchema,
    404: simpleBadRequestSchema,
    400: simpleBadRequestSchema,
  },
};

export type createAnoLectivoBodyType = z.infer<
  typeof createAnoLectivoSchema.body
>;
export type anoLectivoParamsType = z.infer<typeof anoLectivoParamsSchema>;
export type createClasseToAnoLectivoBodyType = z.infer<
  typeof createClasseToAnoLectivoSchema.body
>;
export type patchAnoLectivoBodyType = z.infer<
  typeof changeAnoLectivoStatusSchema.body
>;

export type changeAnoLectivoMatriculaAbertaBodyType = z.infer<
  typeof changeAnoLectivoMatriculaAbertaSchema.body
>;
