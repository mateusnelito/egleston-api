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
  TURNO_BASE_DATE,
} from '../utils/constants';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
  throwValidationError,
} from '../utils/utilsFunctions';

export async function createTurnoController(
  request: FastifyRequest<{ Body: turnoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;

  const inicioDate = new Date(`${TURNO_BASE_DATE} ${inicio}`);
  const terminoDate = new Date(`${TURNO_BASE_DATE} ${termino}`);

  if (isBeginDateAfterEndDate(inicioDate, terminoDate))
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Turno inválido.', {
      inicio: ['Início não pode ser após o término.'],
    });

  const turnoDurationHours = calculateTimeBetweenDates(
    inicioDate,
    terminoDate,
    'hours'
  );

  if (turnoDurationHours < MINIMUM_DURATION_HOURS)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno inválido.', {
      termino: [
        `A duração do turno deve ser no minimo de ${MINIMUM_DURATION_HOURS}h.`,
      ],
    });

  if (turnoDurationHours > MAXIMUM_DURATION_HOURS)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno inválido.', {
      termino: [
        `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION_HOURS}h.`,
      ],
    });

  const [isTurnoNome, isTurnoId] = await Promise.all([
    getTurnoByNome(nome),
    getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (isTurnoNome)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Turno inválido.', {
      nome: ['Nome de turno já existe.'],
    });

  if (isTurnoId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Turno já existe.');

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
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Turno inválido.', {
      inicio: ['Início não pode ser após o término.'],
    });

  const turnoDurationHours = calculateTimeBetweenDates(
    inicioDate,
    terminoDate,
    'hours'
  );

  if (turnoDurationHours < MINIMUM_DURATION_HOURS)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno inválido.', {
      termino: [
        `A duração do turno deve ser no minimo de ${MINIMUM_DURATION_HOURS}h.`,
      ],
    });

  if (turnoDurationHours > MAXIMUM_DURATION_HOURS)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno inválido.', {
      termino: [
        `A duração do turno deve ser no maximo de ${MAXIMUM_DURATION_HOURS}h.`,
      ],
    });

  const [isTurnoId, turnoNome, turno] = await Promise.all([
    getTurnoId(turnoId),
    getTurnoByNome(nome),
    getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (!isTurnoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno não encontrado.');

  if (turnoNome && turnoNome.id !== turnoId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Turno inválido.', {
      nome: ['Nome de turno já existe.'],
    });

  if (turno && turno.id !== turnoId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Turno já existe.');

  const turnoUpdated = await updateTurno(turnoId, { nome, inicio, termino });
  return reply.send(turnoUpdated);
}

export async function getTurnoController(
  request: FastifyRequest<{ Params: turnoParamsType }>,
  reply: FastifyReply
) {
  const { turnoId } = request.params;
  const turno = await getTurno(turnoId);

  if (!turno)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turno não encontrado.');

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
