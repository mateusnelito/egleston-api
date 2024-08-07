import { FastifyReply, FastifyRequest } from 'fastify';
import { turmaBodyType, turmaParamsType } from '../schemas/turmaSchemas';
import { getClasseId } from '../services/classeServices';
import { getSalaId } from '../services/salaServices';
import {
  updateTurma,
  getTurma,
  getTurmaByUniqueCompostKey,
  getTurmaId,
  createTurma,
} from '../services/turmaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundClasseIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Classe inválida',
    errors: { classeId: 'ID da classe não existe.' },
  });
}

function throwNotFoundSalaIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Sala inválida',
    errors: { salaId: 'ID da sala não existe.' },
  });
}

function throwTurmaAlreadyExistError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turma já existe.',
  });
}

function throwNotFoundTurmaIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da turma não existe.',
  });
}

export async function createTurmaController(
  request: FastifyRequest<{ Body: turmaBodyType }>,
  reply: FastifyReply
) {
  const { nome, classeId, salaId } = request.body;
  const [isClasseId, isSalaId, isTurmaId] = await Promise.all([
    await getClasseId(classeId),
    await getSalaId(salaId),
    await getTurmaByUniqueCompostKey(nome, classeId, salaId),
  ]);

  if (!isClasseId) throwNotFoundClasseIdError();
  if (!isSalaId) throwNotFoundSalaIdError();
  if (isTurmaId) throwTurmaAlreadyExistError();

  // TODO: SEND A BETTER RESPONSE
  const turma = await createTurma({ nome, classeId, salaId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}

export async function updateTurmaController(
  request: FastifyRequest<{ Params: turmaParamsType; Body: turmaBodyType }>,
  reply: FastifyReply
) {
  const { nome, classeId, salaId } = request.body;
  const { turmaId } = request.params;

  const [isTurmaId, isClasseId, isSalaId, turma] = await Promise.all([
    await getTurmaId(turmaId),
    await getClasseId(classeId),
    await getSalaId(salaId),
    await getTurmaByUniqueCompostKey(nome, classeId, salaId),
  ]);

  if (!isTurmaId) throwNotFoundTurmaIdError();
  if (!isClasseId) throwNotFoundClasseIdError();
  if (!isSalaId) throwNotFoundSalaIdError();
  if (turma && turma.id !== turmaId) throwTurmaAlreadyExistError();

  const turmaUpdated = await updateTurma(turmaId, { nome, classeId, salaId });
  // TODO: SEND A BETTER RESPONSE
  return reply.send(turmaUpdated);
}

export async function getTurmaController(
  request: FastifyRequest<{ Params: turmaParamsType }>,
  reply: FastifyReply
) {
  const { turmaId } = request.params;

  const turma = await getTurma(turmaId);
  if (!turma) throwNotFoundTurmaIdError();

  // TODO: SEND A BETTER RESPONSE
  return reply.send(turma);
}
