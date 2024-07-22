import { FastifyReply, FastifyRequest } from 'fastify';
import { postClasseBodyType } from '../schemas/classeSchemas';
import { getAnoLectivoId } from '../services/anoLectivoServices';
import { getCursoId } from '../services/cursoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  getClasseByCompostUniqueKey,
  saveClasse,
} from '../services/classeServices';

export async function createClasse(
  request: FastifyRequest<{ Body: postClasseBodyType }>,
  reply: FastifyReply
) {
  const { nome, anoLectivoId, cursoId } = request.body;

  const [isAnoLectivo, isCurso] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivo) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Ano lectivo inválido',
      errors: { anoLectivoId: ['ID do ano lectivo não existe.'] },
    });
  }

  if (!isCurso) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Curso inválido',
      errors: { cursoId: ['ID do curso não existe.'] },
    });
  }

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
