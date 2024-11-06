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
import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import { throwNotFoundSalaIdFieldError } from '../utils/controllers/salaControllerUtils';
import {
  throwDuplicatedTurmaError,
  throwNotFoundTurmaIdError,
} from '../utils/controllers/turmaControllerUtils';
import { throwNotFoundTurnoIdFieldError } from '../utils/controllers/turnoControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';

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

  if (!isClasseId) throwNotFoundClasseIdFieldError();
  if (!isSalaId) throwNotFoundSalaIdFieldError();
  if (!isTurnoId) throwNotFoundTurnoIdFieldError();
  if (isTurmaId) throwDuplicatedTurmaError();

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

  if (!isTurmaId) throwNotFoundTurmaIdError();
  if (!isClasseId) throwNotFoundClasseIdFieldError();
  if (!isSalaId) throwNotFoundSalaIdFieldError();
  if (!isTurnoId) throwNotFoundTurnoIdFieldError();
  if (turma && turma.id !== turmaId) throwDuplicatedTurmaError();

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

  if (!turma) throwNotFoundTurmaIdError();

  // TODO: SEND A BETTER RESPONSE
  return reply.send(turma);
}

export async function getTurmaProfessoresController(
  request: FastifyRequest<{ Params: turmaParamsType }>,
  reply: FastifyReply
) {
  const { turmaId } = request.params;
  const turma = await getTurmaId(turmaId);

  if (!turma) throwNotFoundTurmaIdError();

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
  if (!turma) throwNotFoundTurmaIdError();

  const alunos = await getAlunosByTurma(turmaId, query);

  let next_cursor =
    alunos.length === query.pageSize ? alunos[alunos.length - 1].id : undefined;

  return reply.send({ data: alunos, next_cursor });
}
