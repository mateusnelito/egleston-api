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
  getClasseCursoOrdem,
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
  throwDuplicatedClasseCursoOrdemError,
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
  const { nome, ordem, cursoId } = request.body;

  const [anoLectivo, curso] = await Promise.all([
    getAnoLectivoActivo(),
    getCursoId(cursoId),
  ]);

  if (!anoLectivo) throwActiveAnoLectivoNotFoundError();
  if (!curso) throwNotFoundCursoIdFieldError();

  const { id: anoLectivoId } = anoLectivo!;

  const [uniqueSavedClasse, uniqueSaveClasseCursoOrdem] = await Promise.all([
    getClasseByUniqueKey(nome, anoLectivoId, cursoId),
    getClasseCursoOrdem(cursoId, ordem),
  ]);

  if (uniqueSavedClasse) throwDuplicatedClasseError();
  if (uniqueSaveClasseCursoOrdem) throwDuplicatedClasseCursoOrdemError();

  const newClasse = await createClasse({
    ...request.body,
    anoLectivoId,
  });

  return reply.status(HttpStatusCodes.CREATED).send(newClasse);
}

export async function updateClasseController(
  request: FastifyRequest<{
    Params: classeParamsType;
    Body: updateClasseBodyType;
  }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const { nome, ordem, cursoId, valorMatricula } = request.body;

  const [classe, anoLectivo, curso] = await Promise.all([
    getClasseId(classeId),
    getAnoLectivoActivo(),
    getCursoId(cursoId),
  ]);

  if (!classe) throwNotFoundClasseIdError();
  if (!anoLectivo) throwActiveAnoLectivoNotFoundError();
  if (!curso) throwNotFoundCursoIdFieldError();

  const { id: anoLectivoId } = anoLectivo!;

  const [uniqueSavedClasse, uniqueSaveClasseCursoOrdem] = await Promise.all([
    getClasseByUniqueKey(nome, anoLectivoId, cursoId),
    getClasseCursoOrdem(cursoId, ordem),
  ]);

  if (uniqueSavedClasse && uniqueSavedClasse.id !== classeId)
    throwDuplicatedClasseError();

  if (uniqueSaveClasseCursoOrdem && uniqueSaveClasseCursoOrdem.id !== classeId)
    throwDuplicatedClasseCursoOrdemError();

  const updatedClasse = await updateClasse(classeId, {
    nome,
    anoLectivoId,
    cursoId,
    valorMatricula,
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
  const { pageSize } = request.query;

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
