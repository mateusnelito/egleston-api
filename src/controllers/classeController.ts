import { FastifyReply, FastifyRequest } from 'fastify';
import {
  classeParamsType,
  createClasseBodyType,
  createTurmaToClasseBodyType,
  getClasseAbsentDisciplinasParamsType,
  getClasseAlunosQueryStringType,
  updateClasseBodyType,
} from '../schemas/classeSchemas';
import { getAnoLectivoActivo } from '../services/anoLectivoServices';
import {
  createClasse,
  getClasse,
  getClasseByUniqueKey,
  getClasseId,
  updateClasse,
} from '../services/classeServices';
import { getCursoId } from '../services/cursoServices';
import { getAbsentProfessorDisciplinas } from '../services/disciplinaServices';
import { getAlunosMatriculaByClasse } from '../services/matriculaServices';
import { getClasseDisciplinas } from '../services/professorDisciplinaClasseServices';
import { getSalaId } from '../services/salaServices';
import {
  createTurma,
  getTurmaByUniqueKey,
  getTurmasByClasse,
} from '../services/turmaServices';
import { getTurnoId } from '../services/turnoServices';
import { throwActiveAnoLectivoNotFoundError } from '../utils/controllers/anoLectivoControllerUtils';
import {
  throwDuplicatedClasseError,
  throwNotFoundClasseIdError,
} from '../utils/controllers/classeControllerUtils';
import { throwNotFoundCursoIdFieldError } from '../utils/controllers/cursoControllerUtils';
import { throwNotFoundSalaIdFieldError } from '../utils/controllers/salaControllerUtils';
import { throwDuplicatedTurmaError } from '../utils/controllers/turmaControllerUtils';
import { throwNotFoundTurnoIdFieldError } from '../utils/controllers/turnoControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';

export async function createClasseController(
  request: FastifyRequest<{ Body: createClasseBodyType }>,
  reply: FastifyReply
) {
  const { nome, cursoId, valorMatricula } = request.body;

  const [activeAnoLectivo, isCursoId] = await Promise.all([
    getAnoLectivoActivo(),
    getCursoId(cursoId),
  ]);

  if (!activeAnoLectivo) throwActiveAnoLectivoNotFoundError();
  if (!isCursoId) throwNotFoundCursoIdFieldError();

  const isClasseId = await getClasseByUniqueKey(
    nome,
    activeAnoLectivo!.id,
    cursoId
  );

  if (isClasseId) throwDuplicatedClasseError();

  // TODO: REFACTOR THIS
  const classe = await createClasse({
    nome,
    anoLectivoId: activeAnoLectivo!.id,
    cursoId,
    valorMatricula: Number(valorMatricula.toFixed(2)),
  });

  // TODO: SEND A BETTER RESPONSE
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}

export async function updateClasseController(
  request: FastifyRequest<{
    Params: classeParamsType;
    Body: updateClasseBodyType;
  }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const { nome, cursoId, valorMatricula } = request.body;

  const [isClasseId, activeAnoLectivo, isCursoId] = await Promise.all([
    getClasseId(classeId),
    getAnoLectivoActivo(),
    getCursoId(cursoId),
  ]);

  if (!isClasseId) throwNotFoundClasseIdError();
  if (!activeAnoLectivo) throwActiveAnoLectivoNotFoundError();
  if (!isCursoId) throwNotFoundCursoIdFieldError();

  const classe = await getClasseByUniqueKey(
    nome,
    activeAnoLectivo!.id,
    cursoId
  );

  if (classe && classe.id !== classeId) throwDuplicatedClasseError();

  const updatedClasse = await updateClasse(classeId, {
    nome,
    anoLectivoId: activeAnoLectivo!.id,
    cursoId,
    valorMatricula: Number(valorMatricula.toFixed(2)),
  });
  return reply.send(updatedClasse);
}

export async function getClasseController(
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const classe = await getClasse(classeId);

  if (!classe) throwNotFoundClasseIdError();

  return reply.send(classe);
}

export async function getClasseTurmasController(
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const isClasseId = await getClasseId(classeId);

  if (!isClasseId) throwNotFoundClasseIdError();

  const turmas = await getTurmasByClasse(classeId);
  return reply.send(turmas);
}

export async function getClasseAlunosController(
  request: FastifyRequest<{
    Params: classeParamsType;
    Querystring: getClasseAlunosQueryStringType;
  }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const { turmaId, pageSize, cursor } = request.query;

  const isClasseId = await getClasseId(classeId);

  if (!isClasseId) throwNotFoundClasseIdError();

  const alunos = await getAlunosMatriculaByClasse(classeId, request.query);

  let next_cursor =
    alunos.length === pageSize ? alunos[alunos.length - 1].id : undefined;

  return reply.send({ data: alunos, next_cursor });
}

export async function getClasseDisciplinasController(
  request: FastifyRequest<{
    Params: classeParamsType;
  }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;

  const isClasseId = await getClasseId(classeId);

  if (!isClasseId) throwNotFoundClasseIdError();

  return reply.send(await getClasseDisciplinas(classeId));
}

export async function createTurmaInClasseController(
  request: FastifyRequest<{
    Params: classeParamsType;
    Body: createTurmaToClasseBodyType;
  }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const { nome, salaId, turnoId } = request.body;

  const [isClasseId, isSalaId, isTurnoId, isTurmaId] = await Promise.all([
    getClasseId(classeId),
    getSalaId(salaId),
    getTurnoId(turnoId),
    getTurmaByUniqueKey(nome, classeId, salaId, turnoId),
  ]);

  if (!isClasseId) throwNotFoundClasseIdError();
  if (!isSalaId) throwNotFoundSalaIdFieldError();
  if (!isTurnoId) throwNotFoundTurnoIdFieldError();
  if (isTurmaId) throwDuplicatedTurmaError();

  const turma = await createTurma({ nome, classeId, salaId, turnoId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}

export async function getClasseDisciplinasAbsentProfessorController(
  request: FastifyRequest<{
    Params: getClasseAbsentDisciplinasParamsType;
  }>,
  reply: FastifyReply
) {
  const { classeId, turmaId } = request.params;

  const isClasseId = await getClasseId(classeId);

  if (!isClasseId) throwNotFoundClasseIdError();

  const disciplinas = await getAbsentProfessorDisciplinas(classeId, turmaId);
  return reply.send(disciplinas);
}
