import { FastifyReply, FastifyRequest } from 'fastify';
import {
  alunoParamsType,
  getAlunosQueryStringType,
  updateAlunoBodyType,
} from '../schemas/alunoSchemas';
import { createResponsavelBodyType } from '../schemas/responsavelSchema';
import {
  getAlunoEmail,
  getAlunoTelefone,
} from '../services/alunoContactoServices';
import {
  getAluno,
  getAlunoId,
  getAlunoResponsaveis,
  getAlunos,
  updateAluno,
} from '../services/alunoServices';
import { getMatriculasByAlunoId } from '../services/matriculaServices';
import { getParentescoId } from '../services/parentescoServices';
import {
  getResponsavelEmail,
  getResponsavelTelefone,
} from '../services/responsavelContactoServices';
import {
  createResponsavel,
  getTotalAlunoResponsaveis,
} from '../services/responsavelServices';
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

export const MINIMUM_ALUNO_AGE = 14;
const MINIMUM_RESPONSAVEIS = 4;

export async function updateAlunoController(
  request: FastifyRequest<{
    Params: alunoParamsType;
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
  if (age < MINIMUM_ALUNO_AGE) {
    throwInvalidDataNascimentoError(
      `Idade inferior a ${MINIMUM_ALUNO_AGE} anos.`
    );
  }

  const [isAlunoId, isAlunoTelefone] = await Promise.all([
    await getAlunoId(alunoId),
    await getAlunoTelefone(telefone),
  ]);

  if (!isAlunoId) throwNotFoundAlunoIdError();
  if (isAlunoTelefone && isAlunoTelefone.alunoId !== alunoId)
    throwInvalidTelefoneError();

  if (email) {
    const isAlunoEmail = await getAlunoEmail(email);
    if (isAlunoEmail && isAlunoEmail.alunoId !== alunoId)
      throwInvalidEmailError();
  }

  const aluno = await updateAluno(alunoId, data);
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
    Params: alunoParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const aluno = await getAluno(alunoId);
  if (!aluno) throwNotFoundAlunoIdError();

  return reply.send(aluno);
}

export async function getAlunoResponsaveisController(
  request: FastifyRequest<{
    Params: alunoParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const isAlunoId = await getAlunoId(alunoId);
  if (!isAlunoId) throwNotFoundAlunoIdError();

  const responsaveis = await getAlunoResponsaveis(alunoId);
  return reply.send({ data: responsaveis });
}

export async function createAlunoResponsavelController(
  request: FastifyRequest<{
    Params: alunoParamsType;
    Body: createResponsavelBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { body: data } = request;

  const { parentescoId } = request.body;
  const { telefone, email } = data.contacto;

  const [
    isAlunoId,
    alunoTotalResponsaveis,
    isParentescoId,
    isResponsavelTelefone,
  ] = await Promise.all([
    await getAlunoId(alunoId),
    await getTotalAlunoResponsaveis(alunoId),
    await getParentescoId(parentescoId),
    await getResponsavelTelefone(telefone),
  ]);

  if (!isAlunoId) throwNotFoundAlunoIdError();

  if (alunoTotalResponsaveis >= MINIMUM_RESPONSAVEIS) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número máximo de responsaveis atingido.',
    });
  }

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // 'Cause nobody has 2 fathers or mothers

  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentescoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: { parentescoId: ['parentescoId não existe.'] },
    });
  }
  if (isResponsavelTelefone) throwInvalidTelefoneError();

  if (email) {
    const isResponsavelEmail = await getResponsavelEmail(email);
    if (isResponsavelEmail) throwInvalidEmailError();
  }

  const responsavel = await createResponsavel(alunoId, request.body);
  return reply.status(HttpStatusCodes.CREATED).send(responsavel);
}

export async function getAlunoMatriculasController(
  request: FastifyRequest<{ Params: alunoParamsType }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const isAlunoId = await getAlunoId(alunoId);

  if (!isAlunoId) throwNotFoundAlunoIdError();

  const alunoMatriculas = await getMatriculasByAlunoId(alunoId);
  return reply.send(alunoMatriculas);
}
