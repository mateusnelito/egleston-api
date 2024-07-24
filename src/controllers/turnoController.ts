import { FastifyReply, FastifyRequest } from 'fastify';
import { postTurnoBodyType } from '../schemas/turnoSchemas';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import BadRequest from '../utils/BadRequest';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  getTurnoByInicioAndTermino,
  getTurnoByNome,
  saveTurno,
} from '../services/turnoServices';
import dayjs from 'dayjs';

function throwTurnoNomeAlreadyExist() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

function throwNotFoundTurno() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do turno não existe.',
  });
}

function throwDurationBadRequest(message: string, reply: FastifyReply) {
  return reply.status(HttpStatusCodes.BAD_REQUEST).send({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message,
  });
}

// Controller const
const BASE_DATE = '2024-07-24';

// Maximum and minimum duration in hours
const MAXIMUM_DURATION = 8;
const MINIMUM_DURATION = 1;

// TODO: REFACTOR THIS CODE
export async function createTurnoController(
  request: FastifyRequest<{ Body: postTurnoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;

  const inicioTime = dayjs(`${BASE_DATE} ${inicio}`);
  const terminoTime = dayjs(`${BASE_DATE} ${termino}`);

  if (inicioTime.isAfter(terminoTime)) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Hora de início inválida.',
      errors: { inicio: ['Início não pode ser após o término.'] },
    });
  }

  const duration = terminoTime.diff(inicioTime, 'hours');

  if (duration < MINIMUM_DURATION)
    throwDurationBadRequest(
      `A duração do turno deve ser no minimo de ${MINIMUM_DURATION}h.`,
      reply
    );

  if (duration > MAXIMUM_DURATION)
    throwDurationBadRequest(
      `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION}h.`,
      reply
    );

  const [isTurnoNome, isTurno] = await Promise.all([
    await getTurnoByNome(nome),
    await getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (isTurnoNome) throwTurnoNomeAlreadyExist();
  if (isTurno) {
    return reply.status(HttpStatusCodes.BAD_REQUEST).send({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: `Turno já existe.`,
    });
  }
  const turno = await saveTurno({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send(turno);
}
