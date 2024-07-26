import { FastifyReply, FastifyRequest } from 'fastify';
import {
  classeParamsType,
  postClasseBodyType,
  postTurmaToClasseBodyType,
} from '../schemas/classeSchemas';
import { getAnoLectivoId } from '../services/anoLectivoServices';
import { getCursoId } from '../services/cursoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  changeClasse,
  getClasseByCompostUniqueKey,
  getClasseId,
  saveClasse,
  getClasse as getClasseService,
} from '../services/classeServices';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  getTurmaByUniqueCompostKey,
  getTurmasByClasse,
  saveTurma,
} from '../services/turmaServices';
import { getSalaId } from '../services/salaServices';

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

export async function createClasse(
  request: FastifyRequest<{ Body: postClasseBodyType }>,
  reply: FastifyReply
) {
  const { nome, anoLectivoId, cursoId } = request.body;

  const [isAnoLectivo, isCurso] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivo) throwNotFoundAnoLectivoIdError();
  if (!isCurso) throwNotFoundCursoIdError();

  const isClasse = await getClasseByCompostUniqueKey(
    nome,
    anoLectivoId,
    cursoId
  );

  if (isClasse) {
    // TODO: Move this code to BadRequest class
    return reply.status(HttpStatusCodes.BAD_REQUEST).send({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Classe já existe.',
    });
  }

  const classe = await saveClasse(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}

export async function updateClasse(
  request: FastifyRequest<{
    Params: classeParamsType;
    Body: postClasseBodyType;
  }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const { nome, anoLectivoId, cursoId } = request.body;

  const isClasse = await getClasseId(classeId);

  if (!isClasse) throwNotFoundClasseIdError();

  const [isAnoLectivo, isCurso] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivo) throwNotFoundAnoLectivoIdError();
  if (!isCurso) throwNotFoundCursoIdError();

  const classe = await getClasseByCompostUniqueKey(nome, anoLectivoId, cursoId);

  if (classe && classe.id !== classeId) {
    // TODO: Move this code to BadRequest class
    return reply.status(HttpStatusCodes.BAD_REQUEST).send({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Classe já existe.',
    });
  }

  const updatedClasse = await changeClasse(classeId, request.body);
  return reply.send(updatedClasse);
}

export async function getClasse(
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const classe = await getClasseService(classeId);

  if (!classe) throwNotFoundClasseIdError();

  return reply.send({
    id: classe?.id,
    nome: classe?.nome,
    anoLectivo: classe?.AnoLectivo?.nome,
    curso: classe?.Curso?.nome,
  });
}

export async function getClasseTurmasController(
  request: FastifyRequest<{ Params: classeParamsType }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const isClasseId = await getClasseId(classeId);

  if (!isClasseId) throwNotFoundClasseIdError();
  const turmas = await getTurmasByClasse(classeId);
  return reply.send({ data: turmas });
}

export async function createTurmaInClasseController(
  request: FastifyRequest<{
    Params: classeParamsType;
    Body: postTurmaToClasseBodyType;
  }>,
  reply: FastifyReply
) {
  const { classeId } = request.params;
  const { nome, salaId } = request.body;

  const [isClasseId, isSalaId, isTurma] = await Promise.all([
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

  if (isTurma) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Turma já registada na classe.',
    });
  }

  const turma = await saveTurma({ nome, classeId, salaId });
  return reply.status(HttpStatusCodes.CREATED).send(turma);
}
