import { FastifyReply, FastifyRequest } from 'fastify';
import { classeParamsType, postClasseBodyType } from '../schemas/classeSchemas';
import { getAnoLectivoId } from '../services/anoLectivoServices';
import { getCursoId } from '../services/cursoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  changeClasse,
  getClasseByCompostUniqueKey,
  getClasseId,
  saveClasse,
} from '../services/classeServices';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundAnoLectivo() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Ano lectivo inválido',
    errors: { anoLectivoId: ['ID do ano lectivo não existe.'] },
  });
}

function throwNotFoundCurso() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Curso inválido',
    errors: { cursoId: ['ID do curso não existe.'] },
  });
}

function throwNotFoundClasse() {
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

  if (!isAnoLectivo) throwNotFoundAnoLectivo();
  if (!isCurso) throwNotFoundCurso();

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

  if (!isClasse) throwNotFoundClasse();

  const [isAnoLectivo, isCurso] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivo) throwNotFoundAnoLectivo();
  if (!isCurso) throwNotFoundCurso();

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
