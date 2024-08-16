import { FastifyReply, FastifyRequest } from 'fastify';
import {
  classeParamsType,
  createClasseBodyType,
  createTurmaToClasseBodyType,
  updateClasseBodyType,
} from '../schemas/classeSchemas';
import { getAnoLectivo, getAnoLectivoId } from '../services/anoLectivoServices';
import { getCursoId } from '../services/cursoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  updateClasse,
  getClasseByCompostUniqueKey,
  getClasseId,
  createClasse,
  getClasse as getClasseService,
} from '../services/classeServices';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  getTurmaByUniqueCompostKey,
  getTurmasByClasse,
  createTurma,
} from '../services/turmaServices';
import { getSalaId } from '../services/salaServices';
import { getTurnoId } from '../services/turnoServices';
import { arrayHasDuplicatedValue } from '../utils/utils';

function throwNotFoundAnoLectivoIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Ano lectivo inválido',
    errors: { anoLectivoId: ['ID do ano lectivo não existe.'] },
  });
}

function throwNotFoundCursoIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Curso inválido',
    errors: { cursoId: ['ID do curso não existe.'] },
  });
}

function throwNotFoundClasseIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da classe não existe.',
  });
}

function throwInvalidTurnosArrayError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turnos inválidos.',
    errors: {
      turnos: ['turnos não podem conter items duplicados.'],
    },
  });
}

export async function createClasseController(
  request: FastifyRequest<{ Body: createClasseBodyType }>,
  reply: FastifyReply
) {
  const { nome, anoLectivoId, cursoId, valorMatricula } = request.body;

  const [anoLectivo, isCursoId] = await Promise.all([
    await getAnoLectivo(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!anoLectivo) throwNotFoundAnoLectivoIdError();
  if (!isCursoId) throwNotFoundCursoIdError();

  const isClasseId = await getClasseByCompostUniqueKey(
    nome,
    anoLectivoId,
    cursoId
  );

  if (isClasseId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Classe já existe.',
    });
  }

  // TODO: REFACTOR THIS
  const classe = await createClasse({
    nome: `${nome} - ${anoLectivo!.nome}`,
    anoLectivoId,
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
  const { nome, anoLectivoId, cursoId, valorMatricula } = request.body;

  const isClasseId = await getClasseId(classeId);
  if (!isClasseId) throwNotFoundClasseIdError();

  const [anoLectivo, isCursoId] = await Promise.all([
    await getAnoLectivo(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!anoLectivo) throwNotFoundAnoLectivoIdError();
  if (!isCursoId) throwNotFoundCursoIdError();

  const classe = await getClasseByCompostUniqueKey(nome, anoLectivoId, cursoId);

  if (classe && classe.id !== classeId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Classe já existe.',
    });
  }

  const updatedClasse = await updateClasse(classeId, {
    nome: `${nome} - ${anoLectivo!.nome}`,
    anoLectivoId,
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
  const classe = await getClasseService(classeId);

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
    getTurmaByUniqueCompostKey(nome, classeId, salaId, turnoId),
    getTurnoId(turnoId),
  ]);

  if (!isClasseId) throwNotFoundClasseIdError();

  if (!isSalaId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Sala inválida',
      errors: { salaId: 'ID da sala não existe.' },
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
      message: 'Turma já registada na classe.',
    });
  }

  const turma = await createTurma({ nome, classeId, salaId, turnoId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}
