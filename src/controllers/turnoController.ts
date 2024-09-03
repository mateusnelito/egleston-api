import { FastifyReply, FastifyRequest } from 'fastify';
import { turnoBodyType, turnoParamsType } from '../schemas/turnoSchemas';
import {
  createTurno,
  getTurno,
  getTurnoByInicioAndTermino,
  getTurnoByNome,
  getTurnoId,
  getTurnos,
  updateTurno,
} from '../services/turnoServices';
import {
  MAXIMUM_DURATION_HOURS,
  MINIMUM_DURATION_HOURS,
  throwDuplicatedTurnoError,
  throwDuplicatedTurnoNomeError,
  throwInvalidTurnoDurationError,
  throwInvalidTurnoInicioError,
  throwNotFoundTurnoIdError,
  throwNotFoundTurnoIdFieldError,
  TURNO_BASE_DATE,
} from '../utils/controllers/turnoControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utilsFunctions';

export async function createTurnoController(
  request: FastifyRequest<{ Body: turnoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;

  const inicioDate = new Date(`${TURNO_BASE_DATE} ${inicio}`);
  const terminoDate = new Date(`${TURNO_BASE_DATE} ${termino}`);

  if (isBeginDateAfterEndDate(inicioDate, terminoDate))
    throwInvalidTurnoInicioError();

  const turnoDurationHours = calculateTimeBetweenDates(
    inicioDate,
    terminoDate,
    'hours'
  );

  if (turnoDurationHours < MINIMUM_DURATION_HOURS)
    throwInvalidTurnoDurationError(
      `A duração do turno deve ser no minimo de ${MINIMUM_DURATION_HOURS}h.`
    );

  if (turnoDurationHours > MAXIMUM_DURATION_HOURS)
    throwInvalidTurnoDurationError(
      `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION_HOURS}h.`
    );

  const [isTurnoNome, isTurnoId] = await Promise.all([
    getTurnoByNome(nome),
    getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (isTurnoNome) throwDuplicatedTurnoNomeError();
  if (isTurnoId) throwDuplicatedTurnoError();

  const turno = await createTurno({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send(turno);
}

export async function updateTurnoController(
  request: FastifyRequest<{ Params: turnoParamsType; Body: turnoBodyType }>,
  reply: FastifyReply
) {
  const { turnoId } = request.params;
  const { nome, inicio, termino } = request.body;
  const inicioDate = new Date(`${TURNO_BASE_DATE} ${inicio}`);
  const terminoDate = new Date(`${TURNO_BASE_DATE} ${termino}`);

  if (isBeginDateAfterEndDate(inicioDate, terminoDate))
    throwInvalidTurnoInicioError();

  const turnoDurationHours = calculateTimeBetweenDates(
    inicioDate,
    terminoDate,
    'hours'
  );

  if (turnoDurationHours < MINIMUM_DURATION_HOURS)
    throwInvalidTurnoDurationError(
      `A duração do turno deve ser no minimo de ${MINIMUM_DURATION_HOURS}h.`
    );

  if (turnoDurationHours > MAXIMUM_DURATION_HOURS)
    throwInvalidTurnoDurationError(
      `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION_HOURS}h.`
    );

  const [isTurnoId, turnoNome, turno] = await Promise.all([
    getTurnoId(turnoId),
    getTurnoByNome(nome),
    getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (!isTurnoId) throwNotFoundTurnoIdError();
  if (turnoNome && turnoNome.id !== turnoId) throwDuplicatedTurnoNomeError();
  if (turno && turno.id !== turnoId) throwDuplicatedTurnoError();

  const turnoUpdated = await updateTurno(turnoId, { nome, inicio, termino });
  return reply.send(turnoUpdated);
}

export async function getTurnoController(
  request: FastifyRequest<{ Params: turnoParamsType }>,
  reply: FastifyReply
) {
  const { turnoId } = request.params;
  const turno = await getTurno(turnoId);

  if (!turno) throwNotFoundTurnoIdError();

  return reply.send(turno);
}

export async function getTurnosController(
  _: FastifyRequest,
  reply: FastifyReply
) {
  const turnos = await getTurnos();
  return reply.send(turnos);
}

// TODO: ADD ENDPOINT TO ASSOCIATE TURNO TO CLASSE
