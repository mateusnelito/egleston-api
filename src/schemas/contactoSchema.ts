import { z } from 'zod';
import { outrosContactosRegEx } from '../utils/regexPatterns';

export const contactoSchema = z.object(
  {
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
      .nullable()
      .optional(),
    outros: z
      .string({
        invalid_type_error:
          'Outros contactos devem estar em formato de string.',
      })
      .trim()
      .regex(outrosContactosRegEx, {
        message:
          'Outros contactos deve possuir entre 5 e 255 caracteres e conter apenas letras, números, espaços, e os caracteres especiais comuns (.,;:\'"-())',
      })
      .nullable()
      .optional(),
  },
  { required_error: 'contacto é obrigatório.' }
);
