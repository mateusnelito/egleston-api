import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createSalaBodyType,
  createTurmaToSalaBodyType,
  salaParamsType,
} from '../schemas/salaSchemas';
import { getClasseId } from '../services/classeServices';
import {
  createSala,
  getSala,
  getSalaByNome,
  getSalaId,
  getSalas,
  updateSala,
} from '../services/salaServices';
import {
  createTurma,
  getTurmaByUniqueCompostKey,
  getTurmasBySala,
} from '../services/turmaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import { getTurnoId } from '../services/turnoServices';

function throwInvalidNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

function throwNotFoundSalaIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da sala não existe.',
  });
}

export async function createSalaController(
  request: FastifyRequest<{ Body: createSalaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;
  const isSalaNome = await getSalaByNome(nome);

  if (isSalaNome) throwInvalidNomeError();
  const sala = await createSala(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(sala);
}

export async function updateSalaController(
  request: FastifyRequest<{ Params: salaParamsType; Body: createSalaBodyType }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;
  const { nome } = request.body;

  const [isSalaId, sala] = await Promise.all([
    await getSalaId(salaId),
    await getSalaByNome(nome),
  ]);

  if (!isSalaId) throwNotFoundSalaIdError();
  if (sala && sala.id !== salaId) throwInvalidNomeError();

  const updatedSala = await updateSala(salaId, request.body);
  return reply.send(updatedSala);
}

export async function getSalaController(
  request: FastifyRequest<{ Params: salaParamsType }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;
  const sala = await getSala(salaId);

  if (!sala) throwNotFoundSalaIdError();
  return reply.send(sala);
}

export async function getSalasController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const salas = await getSalas();
  return reply.send(salas);
}

export async function getSalaTurmasController(
  request: FastifyRequest<{ Params: salaParamsType }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;
  const isSalaId = await getSalaId(salaId);

  if (!isSalaId) throwNotFoundSalaIdError();
  const turmas = await getTurmasBySala(salaId);
  return reply.send(turmas);
}

export async function createTurmaInSalaController(
  request: FastifyRequest<{
    Params: salaParamsType;
    Body: createTurmaToSalaBodyType;
  }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;
  const { nome, classeId, turnoId } = request.body;

  const [isClasseId, isSalaId, isTurnoId, isTurmaId] = await Promise.all([
    getClasseId(classeId),
    getSalaId(salaId),
    getTurnoId(turnoId),
    getTurmaByUniqueCompostKey(nome, salaId, salaId, turnoId),
  ]);

  if (!isSalaId) throwNotFoundSalaIdError();
  if (!isClasseId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Classe inválida',
      errors: { classeId: 'ID da classe não existe.' },
    });
  }

  if (!isTurnoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Turno inválido',
      errors: { turnoId: 'ID do turno não existe.' },
    });
  }

  if (isTurmaId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Turma já registada na sala.',
    });
  }

  const turma = await createTurma({ nome, classeId, salaId, turnoId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}
