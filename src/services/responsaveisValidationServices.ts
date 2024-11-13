import { createResponsavelBodyType } from '../schemas/responsavelSchema';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';
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

  if (!isParentescoId)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Responsavel inválido', {
      aluno: {
        responsaveis: {
          [index]: {
            parentescoId: ['parentescoId não existe.'],
          },
        },
      },
    });

  if (isResponsavelTelefone)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Responsavel inválido.', {
      aluno: {
        responsaveis: {
          [index]: {
            contacto: {
              telefone: ['O número de telefone já está sendo usado.'],
            },
          },
        },
      },
    });

  if (isResponsavelEmail)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Responsavel inválido', {
      aluno: {
        responsaveis: {
          [index]: {
            contacto: {
              email: ['O endereço de email já está sendo usado.'],
            },
          },
        },
      },
    });
}
