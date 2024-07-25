import { FastifyReply, FastifyRequest } from 'fastify';
import { postTurnoBodyType } from '../schemas/turnoSchemas';
import {
  getTurnoByInicioAndTermino,
  getTurnoByNome,
  saveTurno,
} from '../services/turnoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utils';

function throwTurnoNomeAlreadyExist() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

function throwInicioBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Hora de início inválida.',
    errors: { inicio: ['Início não pode ser após o término.'] },
  });
}

function throwTurnoAlreadyExistBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turno já existe.',
  });
}

function throwNotFoundTurno() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do turno não existe.',
  });
}

function throwDurationBadRequest(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message,
  });
}

// Controller const
const BASE_DATE = '2024-07-24';
const MAXIMUM_DURATION_HOURS = 8;
const MINIMUM_DURATION_HOURS = 1;

export async function createTurnoController(
  request: FastifyRequest<{ Body: postTurnoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;

  const inicioDate = new Date(`${BASE_DATE} ${inicio}`);
  const terminoDate = new Date(`${BASE_DATE} ${termino}`);

  if (isBeginDateAfterEndDate(inicioDate, terminoDate)) throwInicioBadRequest();

  const turnoDurationHours = calculateTimeBetweenDates(
    inicioDate,
    terminoDate,
    'hours'
  );

  if (turnoDurationHours < MINIMUM_DURATION_HOURS)
    throwDurationBadRequest(
      `A duração do turno deve ser no minimo de ${MINIMUM_DURATION_HOURS}h.`
    );

  if (turnoDurationHours > MAXIMUM_DURATION_HOURS)
    throwDurationBadRequest(
      `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION_HOURS}h.`
    );

  const [isTurnoNome, isTurno] = await Promise.all([
    await getTurnoByNome(nome),
    await getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (isTurnoNome) throwTurnoNomeAlreadyExist();
  if (isTurno) throwTurnoAlreadyExistBadRequest();

  const turno = await saveTurno({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send(turno);
}
