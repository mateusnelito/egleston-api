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
  getTurmaByUniqueKey,
  getTurmasBySala,
} from '../services/turmaServices';
import { getTurnoId } from '../services/turnoServices';
import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import {
  throwDuplicatedSalaNomeError,
  throwNotFoundSalaIdError,
} from '../utils/controllers/salaControllerUtils';
import { throwNotFoundTurmaIdFieldError } from '../utils/controllers/turmaControllerUtils';
import { throwNotFoundTurnoIdFieldError } from '../utils/controllers/turnoControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';

export async function createSalaController(
  request: FastifyRequest<{ Body: createSalaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;
  const isSalaNome = await getSalaByNome(nome);

  if (isSalaNome) throwDuplicatedSalaNomeError();

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
    getSalaId(salaId),
    getSalaByNome(nome),
  ]);

  if (!isSalaId) throwNotFoundSalaIdError();
  if (sala && sala.id !== salaId) throwDuplicatedSalaNomeError();

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
  _: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(await getSalas());
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
    getTurmaByUniqueKey(nome, salaId, salaId, turnoId),
  ]);

  if (!isSalaId) throwNotFoundSalaIdError();
  if (!isClasseId) throwNotFoundClasseIdFieldError();
  if (!isTurnoId) throwNotFoundTurnoIdFieldError();
  if (isTurmaId) throwNotFoundTurmaIdFieldError();

  const turma = await createTurma({ nome, classeId, salaId, turnoId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}
