import { z } from 'zod';
import { descricaoRegEx } from '../utils/regexPatterns';
import { complexBadRequestSchema } from './globalSchema';

const pagamentoBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do pagamento é obrigatório.',
      invalid_type_error: 'O id do pagamento deve ser número.',
    })
    .int({ message: 'O id do pagamento deve ser inteiro.' })
    .positive({ message: 'O id do pagamento deve ser positivo.' }),
  alunoId: z
    .number({
      required_error: 'O id do aluno é obrigatório.',
      invalid_type_error: 'O id do aluno deve ser número.',
    })
    .int({ message: 'O id do aluno deve ser inteiro.' })
    .positive({ message: 'O id do aluno deve ser positivo.' }),
  tipoPagamento: z.enum(['Propina', 'Matricula', 'Confirmacao'], {
    message:
      'O tipo de pagamento deve ser "Propina", "Matricula" ou "Confirmacao".',
  }),
  valor: z
    .number({
      required_error: 'O valor do pagamento é obrigatório.',
      invalid_type_error: 'O valor do pagamento deve ser número.',
    })
    .positive({ message: 'O valor do pagamento deve ser positivo.' }),
  descricao: z
    .string({
      required_error: 'A descrição do pagamento é obrigatória.',
      invalid_type_error: 'A descrição do pagamento deve ser uma string.',
    })
    .trim()
    .regex(descricaoRegEx, {
      message:
        'A descrição do pagamento deve conter apenas letras, números, espaços e pontuação básica, com comprimento entre 10 e 500 caracteres.',
    })
    .nullable(),
  metodoPagamentoId: z
    .number({
      required_error: 'O id do metodo de pagamento é obrigatório.',
      invalid_type_error: 'O id do metodo de pagamento deve ser número.',
    })
    .int({ message: 'O id do metodo de pagamento deve ser inteiro.' })
    .positive({ message: 'O id do metodo de pagamento deve ser positivo.' }),
  anoLectivoId: z
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
  createdAt: z.date({ message: 'createdAt deve ser uma data.' }).nullable(),
});

export const createPagamentoSchema = {
  summary: 'Cria uma novo pagamento',
  tags: ['pagamentos'],
  body: pagamentoBodySchema.omit({ id: true, createdAt: true }),
  response: {
    // 201: matriculaBodySchema,
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export type createPagamentoBodyType = z.infer<
  typeof createPagamentoSchema.body
>;
