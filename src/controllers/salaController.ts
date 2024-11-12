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
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';

export async function createSalaController(
  request: FastifyRequest<{ Body: createSalaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;
  const isSalaNome = await getSalaByNome(nome);

  if (isSalaNome)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Sala inválida.', {
      nome: ['Nome da sala já existe.'],
    });

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

  if (!isSalaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Sala não encontrada.');

  if (sala && sala.id !== salaId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Sala inválida.', {
      nome: ['Nome da sala já existe.'],
    });

  const updatedSala = await updateSala(salaId, request.body);
  return reply.send(updatedSala);
}

export async function getSalaController(
  request: FastifyRequest<{ Params: salaParamsType }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;
  const sala = await getSala(salaId);

  if (!sala)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Sala não encontrada.');

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

  if (!isSalaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Sala não encontrada.');

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

  if (!isSalaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Sala não encontrada.');

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe inválida.', {
      classeId: ['Classe não encontrada'],
    });

  if (!isTurnoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno inválido.', {
      turnoId: ['Turno não encontrado'],
    });

  if (isTurmaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turma inválida.', {
      turmaId: ['Turma não encontrada.'],
    });

  const turma = await createTurma({ nome, classeId, salaId, turnoId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}
