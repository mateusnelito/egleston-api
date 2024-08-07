import { z } from 'zod';
export const enderecoSchema = z.object(
  {
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
  },
  {
    required_error: 'endereço é obrigatório.',
    invalid_type_error: 'endereco deve ser um object.',
  }
);
