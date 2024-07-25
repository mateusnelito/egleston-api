import { FastifyReply, FastifyRequest } from 'fastify';
import { turmaBodyType } from '../schemas/turmaSchemas';
import { getClasseId } from '../services/classeServices';
import { getSalaId } from '../services/salaServices';
import {
  getTurmaByUniqueCompostKey,
  saveTurma,
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

export async function createTurmaController(
  request: FastifyRequest<{ Body: turmaBodyType }>,
  reply: FastifyReply
) {
  const { nome, classeId, salaId } = request.body;
  const [isClasseId, isSalaId, isTurma] = await Promise.all([
    await getClasseId(classeId),
    await getSalaId(salaId),
    await getTurmaByUniqueCompostKey(nome, classeId, salaId),
  ]);

  if (!isClasseId) throwNotFoundClasseIdError();
  if (!isSalaId) throwNotFoundSalaIdError();
  if (isTurma) throwTurmaAlreadyExistError();

  const turma = await saveTurma({ nome, classeId, salaId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}
