import { FastifyReply, FastifyRequest } from 'fastify';
import {
  alunoParamsSchema,
  getAlunosQueryStringType,
  storeAlunoBodyType,
  updateAlunoBodyType,
} from '../schemas/alunoSchemas';
import {
  getAlunoEmail,
  getAlunoTelefone,
} from '../services/alunoContactoServices';
import {
  changeAluno,
  getAlunos,
  getAlunoResponsaveis,
  getAlunoDetails,
  getAlunoId,
  getAlunoNumeroBi,
  saveAluno,
} from '../services/alunoServices';
import { getParentescoById } from '../services/parentescoServices';
import {
  getResponsavelEmail,
  getResponsavelTelefone,
} from '../services/responsavelContactoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utils';

function throwInvalidDataNascimentoError(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de nascimento inválida.',
    errors: { dataNascimento: [message] },
  });
}

function throwInvalidTelefoneError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Número de telefone inválido.',
    errors: {
      contacto: { telefone: ['O número de telefone já está sendo usado.'] },
    },
  });
}

function throwInvalidEmailError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Endereço de email inválido.',
    errors: {
      contacto: { email: ['O endereço de email já está sendo usado.'] },
    },
  });
}

function throwNotFoundAlunoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de aluno não existe.',
  });
}

const MINIMUM_AGE = 14;

export async function createAlunoController(
  request: FastifyRequest<{ Body: storeAlunoBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { responsaveis } = data;

  const { dataNascimento, numeroBi } = data;
  const { telefone, email } = data.contacto;
  const dataNascimentoDate = new Date(dataNascimento);

  if (isBeginDateAfterEndDate(dataNascimentoDate, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const age = calculateTimeBetweenDates(dataNascimentoDate, new Date(), 'y');
  if (age < MINIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade inferior a ${MINIMUM_AGE} anos.`);
  }

  const [alunoNumeroBi, alunoContactoTelefone] = await Promise.all([
    await getAlunoNumeroBi(numeroBi),
    await getAlunoTelefone(telefone),
  ]);

  if (alunoNumeroBi) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de BI inválido.',
      errors: { numeroBi: ['O número de BI já sendo usado.'] },
    });
  }

  if (alunoContactoTelefone) throwInvalidTelefoneError();

  if (email) {
    const alunoContactoEmail = await getAlunoEmail(email);
    if (alunoContactoEmail) throwInvalidEmailError();
  }

  // TODO: ADD A LIMIT FOR RESPONSAVEIS
  for (let i = 0; i < responsaveis.length; i++) {
    const responsavel = responsaveis[i];
    const { telefone, email } = responsavel.contacto;
    const { parentescoId } = responsavel;

    const [responsavelParentescoId, responsavelContactoTelefone] =
      await Promise.all([
        await getParentescoById(parentescoId),
        await getResponsavelTelefone(telefone),
      ]);

    if (!responsavelParentescoId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Parentesco inválido.',
        errors: {
          responsaveis: {
            [i]: {
              parentescoId: ['parentescoId não existe.'],
            },
          },
        },
      });
    }

    if (responsavelContactoTelefone) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Número de telefone inválido.',
        errors: {
          responsaveis: {
            [i]: {
              contacto: {
                telefone: ['O número de telefone já está sendo usado.'],
              },
            },
          },
        },
      });
    }

    if (email) {
      const responsavelContactoEmail = await getResponsavelEmail(email);
      if (responsavelContactoEmail) {
        throw new BadRequest({
          statusCode: HttpStatusCodes.BAD_REQUEST,
          message: 'Endereço de email inválido.',
          errors: {
            responsaveis: {
              [i]: {
                contacto: {
                  email: ['O endereço de email já está sendo usado.'],
                },
              },
            },
          },
        });
      }
    }
  }

  const aluno = await saveAluno(data);
  return reply.status(HttpStatusCodes.CREATED).send(aluno);
}

export async function updateAlunoController(
  request: FastifyRequest<{
    Params: alunoParamsSchema;
    Body: updateAlunoBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { body: data } = request;

  const { dataNascimento } = data;
  const { telefone, email } = data.contacto;
  const dataNascimentoDate = new Date(dataNascimento);

  if (isBeginDateAfterEndDate(dataNascimentoDate, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const age = calculateTimeBetweenDates(dataNascimentoDate, new Date(), 'y');
  if (age < MINIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade inferior a ${MINIMUM_AGE} anos.`);
  }

  const [isAlunoId, alunoContactoTelefone] = await Promise.all([
    await getAlunoId(alunoId),
    await getAlunoTelefone(telefone),
  ]);

  if (!isAlunoId) throwNotFoundAlunoIdError();
  if (alunoContactoTelefone && alunoContactoTelefone.alunoId !== alunoId)
    throwInvalidTelefoneError();

  if (email) {
    const alunoContactoEmail = await getAlunoEmail(email);
    if (alunoContactoEmail && alunoContactoEmail.alunoId !== alunoId)
      throwInvalidEmailError();
  }

  const aluno = await changeAluno(alunoId, data);
  return reply.send(aluno);
}

export async function getAlunosController(
  request: FastifyRequest<{ Querystring: getAlunosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const alunos = await getAlunos(page_size, cursor);

  // Determine the next cursor
  let next_cursor =
    alunos.length === page_size ? alunos[alunos.length - 1].id : undefined;

  return reply.send({
    data: alunos,
    next_cursor,
  });
}

export async function getAlunoController(
  request: FastifyRequest<{
    Params: alunoParamsSchema;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const aluno = await getAlunoDetails(alunoId);
  if (!aluno) throwNotFoundAlunoIdError();

  return reply.send(aluno);
}

export async function getResponsaveis(
  request: FastifyRequest<{
    Params: alunoParamsSchema;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const isAluno = await getAlunoId(alunoId);
  if (!isAluno) throwNotFoundAlunoIdError();

  const responsaveis = await getAlunoResponsaveis(alunoId);
  return reply.send({ data: responsaveis });
}
