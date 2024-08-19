import { createResponsavelBodyType } from '../schemas/responsavelSchema';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { getParentescoId } from './parentescoServices';
import {
  getResponsavelEmail,
  getResponsavelTelefone,
} from './responsavelContactoServices';

export async function validateResponsavelData(
  responsavel: createResponsavelBodyType,
  index: number
) {
  const { telefone, email } = responsavel.contacto;
  const { parentescoId } = responsavel;

  const [isParentescoId, isResponsavelTelefone, isResponsavelEmail] =
    await Promise.all([
      getParentescoId(parentescoId),
      getResponsavelTelefone(telefone),
      email ? getResponsavelEmail(email) : null,
    ]);

  if (!isParentescoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: {
        aluno: {
          responsaveis: {
            [index]: {
              parentescoId: ['parentescoId não existe.'],
            },
          },
        },
      },
    });
  }

  if (isResponsavelTelefone) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de telefone inválido.',
      errors: {
        aluno: {
          responsaveis: {
            [index]: {
              contacto: {
                telefone: ['O número de telefone já está sendo usado.'],
              },
            },
          },
        },
      },
    });
  }

  if (isResponsavelEmail) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Endereço de email inválido.',
      errors: {
        aluno: {
          responsaveis: {
            [index]: {
              contacto: {
                email: ['O endereço de email já está sendo usado.'],
              },
            },
          },
        },
      },
    });
  }
}
