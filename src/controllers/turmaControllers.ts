import { FastifyReply, FastifyRequest } from 'fastify';
import { getResourcesDefaultQueriesType } from '../schemas/globalSchema';
import { turmaBodyType, turmaParamsType } from '../schemas/turmaSchemas';
import { getClasseId } from '../services/classeServices';
import { getAlunosByTurma } from '../services/matriculaServices';
import { getTurmaProfessores } from '../services/professorDisciplinaClasseServices';
import { getSalaId } from '../services/salaServices';
import {
  createTurma,
  getTurma,
  getTurmaByUniqueKey,
  getTurmaId,
  updateTurma,
} from '../services/turmaServices';
import { getTurnoId } from '../services/turnoServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';

export async function createTurmaController(
  request: FastifyRequest<{ Body: turmaBodyType }>,
  reply: FastifyReply
) {
  const { nome, classeId, salaId, turnoId } = request.body;
  const [isClasseId, isSalaId, isTurnoId, isTurmaId] = await Promise.all([
    getClasseId(classeId),
    getSalaId(salaId),
    getTurnoId(turnoId),
    getTurmaByUniqueKey(nome, classeId, salaId, turnoId),
  ]);

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe inválida.', {
      classeId: ['Classe não encontrada'],
    });

  if (!isSalaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Sala inválida.', {
      salaId: ['Sala não encontrada.'],
    });

  if (!isTurnoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno inválido.', {
      turnoId: ['Turno não encontrado'],
    });

  if (isTurmaId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Turma já existe.');

  // TODO: SEND A BETTER RESPONSE
  const turma = await createTurma({ nome, classeId, salaId, turnoId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}

export async function updateTurmaController(
  request: FastifyRequest<{ Params: turmaParamsType; Body: turmaBodyType }>,
  reply: FastifyReply
) {
  const { turmaId } = request.params;
  const { nome, classeId, salaId, turnoId } = request.body;

  const [isTurmaId, isClasseId, isSalaId, isTurnoId, turma] = await Promise.all(
    [
      getTurmaId(turmaId),
      getClasseId(classeId),
      getSalaId(salaId),
      getTurnoId(turnoId),
      getTurmaByUniqueKey(nome, classeId, salaId, turnoId),
    ]
  );

  if (!isTurmaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turma não encontrada.');

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe inválida.', {
      classeId: ['Classe não encontrada'],
    });

  if (!isSalaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Sala inválida.', {
      salaId: ['Sala não encontrada.'],
    });

  if (!isTurnoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno inválido.', {
      turnoId: ['Turno não encontrado'],
    });
  if (turma && turma.id !== turmaId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Turma já existe.');

  const turmaUpdated = await updateTurma(turmaId, {
    nome,
    classeId,
    salaId,
    turnoId,
  });

  // TODO: SEND A BETTER RESPONSE
  return reply.send(turmaUpdated);
}

export async function getTurmaController(
  request: FastifyRequest<{ Params: turmaParamsType }>,
  reply: FastifyReply
) {
  const { turmaId } = request.params;
  const turma = await getTurma(turmaId);

  if (!turma)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turma não encontrada.');

  // TODO: SEND A BETTER RESPONSE
  return reply.send(turma);
}

export async function getTurmaProfessoresController(
  request: FastifyRequest<{ Params: turmaParamsType }>,
  reply: FastifyReply
) {
  const { turmaId } = request.params;
  const turma = await getTurmaId(turmaId);

  if (!turma)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turma não encontrada.');

  const professores = await getTurmaProfessores(turmaId);
  return reply.send(professores);
}

export async function getTurmaAlunosController(
  request: FastifyRequest<{
    Params: turmaParamsType;
    Querystring: getResourcesDefaultQueriesType;
  }>,
  reply: FastifyReply
) {
  const { turmaId } = request.params;
  const { query } = request;

  const turma = await getTurmaId(turmaId);
  if (!turma)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turma não encontrada.');

  const alunos = await getAlunosByTurma(turmaId, query);

  let next_cursor =
    alunos.length === query.pageSize ? alunos[alunos.length - 1].id : undefined;

  return reply.send({ data: alunos, next_cursor });
}
