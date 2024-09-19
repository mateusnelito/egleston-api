import { FastifyReply, FastifyRequest } from 'fastify';
import {
  classeParamsType,
  createClasseBodyType,
  createTurmaToClasseBodyType,
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
import { getAlunosMatriculaByClasse } from '../services/matriculaServices';

export async function createClasseController(
  request: FastifyRequest<{ Body: createClasseBodyType }>,
  reply: FastifyReply
) {
  const { nome, cursoId, valorMatricula } = request.body;

  const [activeAnoLectivo, isCursoId] = await Promise.all([
    getAnoLectivoActivo(true),
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
    getAnoLectivoActivo(true),
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
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const isClasseId = await getClasseId(classeId);

  if (!isClasseId) throwNotFoundClasseIdError();

  return reply.send(await getAlunosMatriculaByClasse(classeId));
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
