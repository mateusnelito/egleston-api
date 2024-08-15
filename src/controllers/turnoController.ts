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
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utils';

function throwTurnoNomeAlreadyError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

function throwInvalidInicioError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Hora de início inválida.',
    errors: { inicio: ['Início não pode ser após o término.'] },
  });
}

function throwTurnoAlreadyExistError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turno já existe.',
  });
}

function throwNotFoundTurnoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do turno não existe.',
  });
}

function throwInvalidYearDurationError(message: string) {
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
  request: FastifyRequest<{ Body: turnoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;

  const inicioDate = new Date(`${BASE_DATE} ${inicio}`);
  const terminoDate = new Date(`${BASE_DATE} ${termino}`);

  if (isBeginDateAfterEndDate(inicioDate, terminoDate))
    throwInvalidInicioError();

  const turnoDurationHours = calculateTimeBetweenDates(
    inicioDate,
    terminoDate,
    'hours'
  );

  if (turnoDurationHours < MINIMUM_DURATION_HOURS)
    throwInvalidYearDurationError(
      `A duração do turno deve ser no minimo de ${MINIMUM_DURATION_HOURS}h.`
    );

  if (turnoDurationHours > MAXIMUM_DURATION_HOURS)
    throwInvalidYearDurationError(
      `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION_HOURS}h.`
    );

  const [isTurnoNome, isTurnoId] = await Promise.all([
    await getTurnoByNome(nome),
    await getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (isTurnoNome) throwTurnoNomeAlreadyError();
  if (isTurnoId) throwTurnoAlreadyExistError();

  const turno = await createTurno({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send(turno);
}

export async function updateTurnoController(
  request: FastifyRequest<{ Params: turnoParamsType; Body: turnoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;

  const inicioDate = new Date(`${BASE_DATE} ${inicio}`);
  const terminoDate = new Date(`${BASE_DATE} ${termino}`);

  if (isBeginDateAfterEndDate(inicioDate, terminoDate))
    throwInvalidInicioError();

  const turnoDurationHours = calculateTimeBetweenDates(
    inicioDate,
    terminoDate,
    'hours'
  );

  if (turnoDurationHours < MINIMUM_DURATION_HOURS)
    throwInvalidYearDurationError(
      `A duração do turno deve ser no minimo de ${MINIMUM_DURATION_HOURS}h.`
    );

  if (turnoDurationHours > MAXIMUM_DURATION_HOURS)
    throwInvalidYearDurationError(
      `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION_HOURS}h.`
    );

  const { turnoId } = request.params;

  const [isTurnoId, turnoNome, turno] = await Promise.all([
    await getTurnoId(turnoId),
    await getTurnoByNome(nome),
    await getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (!isTurnoId) throwNotFoundTurnoIdError();
  if (turnoNome && turnoNome.id !== turnoId) throwTurnoNomeAlreadyError();
  if (turno && turno.id !== turnoId) throwTurnoAlreadyExistError();

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
  request: FastifyRequest,
  reply: FastifyReply
) {
  const turnos = await getTurnos();
  return reply.send(turnos);
}
