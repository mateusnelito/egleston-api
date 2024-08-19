import { createAlunoBodyType } from '../schemas/alunoSchemas';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utils';
import { getAlunoEmail, getAlunoTelefone } from './alunoContactoServices';
import { getAlunoNumeroBi } from './alunoServices';

function throwInvalidDataNascimentoError(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de nascimento inválida.',
    errors: { dataNascimento: [message] },
  });
}

const MINIMUM_ALUNO_AGE = 14;

export async function validateAlunoData(alunoData: createAlunoBodyType) {
  const { dataNascimento, numeroBi } = alunoData;
  const { telefone, email } = alunoData.contacto;

  if (isBeginDateAfterEndDate(dataNascimento, new Date())) {
    throwInvalidDataNascimentoError(
      'Data de nascimento não pode estar no futuro.'
    );
  }

  const alunoAge = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');
  if (alunoAge < MINIMUM_ALUNO_AGE) {
    throwInvalidDataNascimentoError(
      `Idade inferior a ${MINIMUM_ALUNO_AGE} anos.`
    );
  }

  const [isAlunoNumeroBi, isAlunoTelefone, isAlunoEmail] = await Promise.all([
    getAlunoNumeroBi(numeroBi),
    getAlunoTelefone(telefone),
    // if email the fn is executed, else isn't
    email ? getAlunoEmail(email) : null,
  ]);

  if (isAlunoNumeroBi) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de BI inválido.',
      errors: { aluno: { numeroBi: ['O número de BI já está sendo usado.'] } },
    });
  }

  if (isAlunoTelefone) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de telefone inválido.',
      errors: {
        aluno: {
          contacto: { telefone: ['O número de telefone já está sendo usado.'] },
        },
      },
    });
  }

  if (isAlunoEmail) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Endereço de email inválido.',
      errors: {
        aluno: {
          contacto: { email: ['O endereço de email já está sendo usado.'] },
        },
      },
    });
  }
}
