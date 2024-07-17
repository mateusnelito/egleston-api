import { FastifyReply, FastifyRequest } from 'fastify';
import { postAnoLectivoBodyType } from '../schemas/anoLectivoSchema';
import {
  getAnoLectivoInicioTermino,
  getAnoLectivoNome,
  saveAnoLectivo,
} from '../services/anoLectivoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';

function throwNomeBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome do ano lectivo inválido.',
    errors: { nome: ['O nome do ano lectivo já existe.'] },
  });
}

// FIXME: add a better and expressive error message
function throwDuplicateAnoLectivoDurationBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Duração do ano lectivo inválido.',
    errors: { nome: ['A duração do ano lectivo já existe.'] },
  });
}

export async function createAnoLectivo(
  request: FastifyRequest<{ Body: postAnoLectivoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;

  // TODO: Add date validation with dayjs

  const [isAnoLectivoNome, isAnoLectivoInicioAndTermino] = await Promise.all([
    await getAnoLectivoNome(nome),
    await getAnoLectivoInicioTermino(inicio, termino),
  ]);

  if (isAnoLectivoNome) throwNomeBadRequest();

  if (isAnoLectivoInicioAndTermino) {
    throwDuplicateAnoLectivoDurationBadRequest();
  }

  const newAnoLectivo = await saveAnoLectivo({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send(newAnoLectivo);
}
