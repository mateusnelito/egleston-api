import { FastifyReply, FastifyRequest } from 'fastify';
import { createMatriculaBodyType } from '../schemas/matriculaSchemas';
import {
  getAlunoEmail,
  getAlunoTelefone,
} from '../services/alunoContactoServices';
import {
  createAlunoWithMatricula,
  getAlunoNumeroBi,
} from '../services/alunoServices';
import { getAnoLectivoId } from '../services/anoLectivoServices';
import { getClasseId } from '../services/classeServices';
import { getCursoId } from '../services/cursoServices';
import { getParentescoId } from '../services/parentescoServices';
import {
  getResponsavelEmail,
  getResponsavelTelefone,
} from '../services/responsavelContactoServices';
import { getTurmaId } from '../services/turmaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  arrayHasDuplicatedValue,
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utils';
import { MINIMUM_ALUNO_AGE } from './alunoController';

function throwInvalidDataNascimentoError(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de nascimento inválida.',
    errors: { aluno: { dataNascimento: [message] } },
  });
}

export async function createMatriculaController(
  request: FastifyRequest<{ Body: createMatriculaBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;

  // Extracting matricula data
  const { classeId, cursoId, turmaId, anoLectivoId } = request.body;

  // Extracting aluno data
  const { aluno: alunoData } = data;
  const { responsaveis: alunoResponsaveis } = alunoData;
  const { dataNascimento, numeroBi } = alunoData;
  const { telefone, email } = alunoData.contacto;

  // # - Aluno
  const responsaveisTelefone = alunoResponsaveis.map(
    (responsavel) => responsavel.contacto.telefone
  );

  const responsaveisEmails = alunoResponsaveis.map(
    (responsavel) => responsavel.contacto?.email
  );

  // TODO: CHECK IF THERE'S DUPLICATED RESPONSAVEIS OBJECT, NOT ONLY DUPLICATED CONTACTS
  if (
    arrayHasDuplicatedValue(responsaveisTelefone) ||
    arrayHasDuplicatedValue(responsaveisEmails)
  ) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Responsaveis inválidos.',
      errors: {
        aluno: {
          responsaveis: ['responsaveis não podem conter contactos duplicados.'],
        },
      },
    });
  }

  if (isBeginDateAfterEndDate(dataNascimento, new Date())) {
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );
  }

  const alunoAge = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');
  if (alunoAge < MINIMUM_ALUNO_AGE) {
    throwInvalidDataNascimentoError(
      `Idade inferior a ${MINIMUM_ALUNO_AGE} anos.`
    );
  }

  // - Checking data integrity
  // # - matricula & aluno
  const [
    isClasseId,
    isCursoId,
    isTurmaId,
    isAnoLectivoId,
    isAlunoNumeroBi,
    isAlunoTelefone,
  ] = await Promise.all([
    getClasseId(classeId),
    getCursoId(cursoId),
    getTurmaId(turmaId),
    getAnoLectivoId(anoLectivoId),
    getAlunoNumeroBi(numeroBi),
    getAlunoTelefone(telefone),
  ]);

  if (!isClasseId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: {
        aluno: {
          classeId: ['ID da classe não existe.'],
        },
      },
    });
  }

  if (!isCursoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: {
        aluno: {
          cursoId: ['ID do curso não existe.'],
        },
      },
    });
  }

  if (!isTurmaId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: {
        aluno: {
          turmaId: ['ID da turma não existe.'],
        },
      },
    });
  }

  if (!isAnoLectivoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: {
        aluno: {
          anoLectivoId: ['ID do ano lectivo não existe.'],
        },
      },
    });
  }

  if (isAlunoNumeroBi) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de BI inválido.',
      errors: { aluno: { numeroBi: ['O número de BI já sendo usado.'] } },
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

  if (email) {
    const isAlunoEmail = await getAlunoEmail(email);
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

  for (let i = 0; i < alunoResponsaveis.length; i++) {
    const responsavel = alunoResponsaveis[i];
    const { telefone, email } = responsavel.contacto;
    const { parentescoId } = responsavel;

    const [isParentescoId, isResponsavelTelefone] = await Promise.all([
      getParentescoId(parentescoId),
      getResponsavelTelefone(telefone),
    ]);

    if (!isParentescoId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Parentesco inválido.',
        errors: {
          aluno: {
            responsaveis: {
              [i]: {
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
              [i]: {
                contacto: {
                  telefone: ['O número de telefone já está sendo usado.'],
                },
              },
            },
          },
        },
      });
    }

    if (email) {
      const isResponsavelEmail = await getResponsavelEmail(email);
      if (isResponsavelEmail) {
        throw new BadRequest({
          statusCode: HttpStatusCodes.BAD_REQUEST,
          message: 'Endereço de email inválido.',
          errors: {
            aluno: {
              responsaveis: {
                [i]: {
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
  }

  const matricula = await createAlunoWithMatricula(data);

  // TODO: SAVE THE PAYMENT AND GENERATE THE RELATOR OR *COMPROVANTE
  return reply.send(matricula);
}
