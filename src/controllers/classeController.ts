import { FastifyReply, FastifyRequest } from 'fastify';
import {
  classeParamsType,
  createClasseBodyType,
  createTurmaToClasseBodyType,
  getClasseAbsentDisciplinasParamsType,
  getClasseAlunosQueryStringType,
  getClassesQueryStringType,
  updateClasseBodyType,
} from '../schemas/classeSchemas';
import { getAnoLectivoActivo } from '../services/anoLectivoServices';
import {
  createClasse,
  getClasse,
  getClasseByUniqueKey,
  getClasseCursoOrdem,
  getClasseCursoWithOrdem,
  getClasseId,
  getClasses,
  getNextClasseByOrdem,
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
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';

export async function createClasseController(
  request: FastifyRequest<{ Body: createClasseBodyType }>,
  reply: FastifyReply
) {
  const { nome, ordem, cursoId } = request.body;

  const [anoLectivo, curso] = await Promise.all([
    getAnoLectivoActivo(),
    getCursoId(cursoId),
  ]);

  if (!anoLectivo)
    throwValidationError(
      HttpStatusCodes.PRECONDITION_FAILED,
      'Nenhum ano lectivo activo encontrado.'
    );

  if (!curso)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso inválido.', {
      cursoId: ['Curso não encontrado'],
    });

  const { id: anoLectivoId } = anoLectivo!;

  const [uniqueSavedClasse, uniqueSaveClasseCursoOrdem] = await Promise.all([
    getClasseByUniqueKey(nome, anoLectivoId, cursoId),
    getClasseCursoOrdem(cursoId, ordem),
  ]);

  if (uniqueSavedClasse)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Classe já existe.');

  if (uniqueSaveClasseCursoOrdem)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Ordem inválida.', {
      ordem: ['Já existe uma classe com a mesma ordem.'],
    });

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

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

  if (!anoLectivo)
    throwValidationError(
      HttpStatusCodes.PRECONDITION_FAILED,
      'Nenhum ano lectivo activo encontrado.'
    );

  if (!curso)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso inválido.', {
      cursoId: ['Curso não encontrado'],
    });

  const { id: anoLectivoId } = anoLectivo!;

  const [uniqueSavedClasse, uniqueSaveClasseCursoOrdem] = await Promise.all([
    getClasseByUniqueKey(nome, anoLectivoId, cursoId),
    getClasseCursoOrdem(cursoId, ordem),
  ]);

  if (uniqueSavedClasse && uniqueSavedClasse.id !== classeId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Classe já existe.');

  if (uniqueSaveClasseCursoOrdem && uniqueSaveClasseCursoOrdem.id !== classeId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Ordem inválida.', {
      ordem: ['Já existe uma classe com a mesma ordem.'],
    });

  const updatedClasse = await updateClasse(classeId, {
    nome,
    anoLectivoId,
    cursoId,
    valorMatricula,
  });

  return reply.send(updatedClasse);
}

export async function getClassesController(
  request: FastifyRequest<{ Querystring: getClassesQueryStringType }>,
  reply: FastifyReply
) {
  const { cursoId, anoLectivoId } = request.query;
  return reply.send(await getClasses(cursoId, anoLectivoId));
}

export async function getClasseController(
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const classe = await getClasse(classeId);

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

  return reply.send(classe);
}

export async function getNextClasseController(
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const classe = await getClasseCursoWithOrdem(classeId);

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

  const {
    ordem,
    Curso: { id: cursoId },
  } = classe!;

  const nextClasse = await getNextClasseByOrdem(ordem, cursoId);

  if (!nextClasse) return reply.status(HttpStatusCodes.NO_CONTENT).send();

  return reply.send(nextClasse);
}

export async function getClasseTurmasController(
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const isClasseId = await getClasseId(classeId);

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

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

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

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

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

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

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

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

  if (!isClasseId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

  const disciplinas = await getAbsentProfessorDisciplinas(classeId, turmaId);
  return reply.send(disciplinas);
}
