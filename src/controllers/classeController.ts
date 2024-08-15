import { FastifyReply, FastifyRequest } from 'fastify';
import {
  classeParamsType,
  createClasseBodyType,
  createTurmaToClasseBodyType,
  updateClasseBodyType,
} from '../schemas/classeSchemas';
import { getAnoLectivoId } from '../services/anoLectivoServices';
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
  const { nome, anoLectivoId, cursoId, turnos } = request.body;

  if (turnos && arrayHasDuplicatedValue(turnos)) throwInvalidTurnosArrayError();

  const [isAnoLectivoId, isCursoId] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivoId) throwNotFoundAnoLectivoIdError();
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

  if (turnos) {
    for (let i = 0; i < turnos.length; i++) {
      const turnoId = turnos[i];
      const isTurnoId = await getTurnoId(turnoId);

      // TODO: Finish the verification before send the errors, to send all invalids turnos
      if (!isTurnoId) {
        throw new BadRequest({
          statusCode: HttpStatusCodes.NOT_FOUND,
          message: 'Turno inválido.',
          errors: {
            turnos: {
              [i]: 'turnoId não existe.',
            },
          },
        });
      }
    }
  }

  // TODO: SEND A BETTER RESPONSE
  const classe = await createClasse(request.body);
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
  const { nome, anoLectivoId, cursoId } = request.body;

  const isClasseId = await getClasseId(classeId);
  if (!isClasseId) throwNotFoundClasseIdError();

  const [isAnoLectivoId, isCursoId] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivoId) throwNotFoundAnoLectivoIdError();
  if (!isCursoId) throwNotFoundCursoIdError();

  const classe = await getClasseByCompostUniqueKey(nome, anoLectivoId, cursoId);

  if (classe && classe.id !== classeId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Classe já existe.',
    });
  }

  const updatedClasse = await updateClasse(classeId, request.body);
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
  const { nome, salaId } = request.body;

  const [isClasseId, isSalaId, isTurmaId] = await Promise.all([
    await getClasseId(classeId),
    await getSalaId(salaId),
    await getTurmaByUniqueCompostKey(nome, classeId, salaId),
  ]);

  if (!isClasseId) throwNotFoundClasseIdError();

  if (!isSalaId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Sala inválida',
      errors: { salaId: 'ID da sala não existe.' },
    });
  }

  if (isTurmaId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Turma já registada na classe.',
    });
  }

  const turma = await createTurma({ nome, classeId, salaId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}
