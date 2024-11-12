import { createAlunoBodyType } from '../schemas/alunoSchemas';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
  throwValidationError,
} from '../utils/utilsFunctions';
import { getAlunoEmail, getAlunoTelefone } from './alunoContactoServices';
import { getAlunoNumeroBi } from './alunoServices';

const MINIMUM_ALUNO_AGE = 14;

export async function validateAlunoData(alunoData: createAlunoBodyType) {
  const { dataNascimento, numeroBi } = alunoData;
  const { telefone, email } = alunoData.contacto;

  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwValidationError(HttpStatusCodes.CONFLICT, 'Aluno inválido.', {
      dataNascimento: ['Data de nascimento não pôde estar no futuro.'],
    });

  const alunoAge = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');

  if (alunoAge < MINIMUM_ALUNO_AGE)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Aluno inválido.', {
      dataNascimento: [`Idade inferior a ${MINIMUM_ALUNO_AGE} anos.`],
    });

  const [isAlunoNumeroBi, isAlunoTelefone, isAlunoEmail] = await Promise.all([
    getAlunoNumeroBi(numeroBi),
    getAlunoTelefone(telefone),
    email ? getAlunoEmail(email) : null,
  ]);

  if (isAlunoNumeroBi) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de BI inválido.',
      errors: { aluno: { numeroBi: ['Número de BI já existe.'] } },
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
