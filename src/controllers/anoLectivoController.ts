import dayjs from 'dayjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  anoLectivoParamsType,
  postAnoLectivoBodyType,
} from '../schemas/anoLectivoSchema';
import {
  changeAnoLectivo,
  getAnoLectivoId,
  getAnoLectivoNome,
  recoveryAnoLectivo,
  recoveryAnoLectivos,
  saveAnoLectivo,
} from '../services/anoLectivoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import { formatDate } from '../utils/utils';

// Constants for month validation
const MIN_MONTHS = 11;
const MAX_MONTHS = 11;

// Validate the beginning and the end of ano lectivo
function checkBeginAndEndDates(inicio: string, termino: string) {
  // FIXME: O dia de inicio do mês não começa em 01 caso for dado com 01.
  // FIXME: e.g: 2024-09-01 -> 2024-08-31
  const begin = dayjs(inicio);
  const end = dayjs(termino);

  if (begin.isAfter(end)) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Data de início inválida.',
      errors: { inicio: ['Início não pode ser após o término.'] },
    });
  }

  const monthsBetweenYears = end.diff(begin, 'M');

  if (monthsBetweenYears < MIN_MONTHS || monthsBetweenYears > MAX_MONTHS) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Ano lectivo inválido',
      errors: { termino: ['A duração do ano lectivo deve ser de 11 meses.'] },
    });
  }
  return { begin: begin.toDate(), end: end.toDate() };
}

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do ano lectivo não existe.',
  });
}

export async function createAnoLectivo(
  request: FastifyRequest<{ Body: postAnoLectivoBodyType }>,
  reply: FastifyReply
) {
  const { inicio, termino } = request.body;
  const { begin, end } = checkBeginAndEndDates(inicio, termino);
  const nome = `${begin.getFullYear()}-${end.getFullYear()}`;

  const isAnoLectivoNome = await getAnoLectivoNome(nome);

  if (isAnoLectivoNome) {
    return reply.status(HttpStatusCodes.BAD_REQUEST).send({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'O ano lectivo já existe.',
    });
  }

  const anoLectivo = await saveAnoLectivo({
    nome,
    inicio: begin,
    termino: end,
  });

  return reply.status(HttpStatusCodes.CREATED).send({
    id: anoLectivo.id,
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
  });
}

export async function updateAnoLectivo(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: postAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { inicio, termino } = request.body;
  const { begin, end } = checkBeginAndEndDates(inicio, termino);
  const nome = `${begin.getFullYear()}-${end.getFullYear()}`;

  const { anoLectivoId } = request.params;

  const [isAnoLectivo, isAnoLectivoNome] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getAnoLectivoNome(nome, anoLectivoId),
  ]);

  if (!isAnoLectivo) throwNotFoundRequest();
  if (isAnoLectivoNome) {
    return reply.status(HttpStatusCodes.BAD_REQUEST).send({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'O ano lectivo já existe.',
    });
  }

  const anoLectivo = await changeAnoLectivo(anoLectivoId, {
    nome,
    inicio: begin,
    termino: end,
  });

  return reply.send({
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
  });
}

export async function getAnoLectivos(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = await recoveryAnoLectivos();
  return reply.send({ data });
}

export async function getAnoLectivo(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await recoveryAnoLectivo(anoLectivoId);

  if (!anoLectivo) {
    throwNotFoundRequest();
  } else {
    return reply.send({
      id: anoLectivo.id,
      nome: anoLectivo.nome,
      inicio: formatDate(anoLectivo.inicio),
      termino: formatDate(anoLectivo.termino),
    });
  }
}
