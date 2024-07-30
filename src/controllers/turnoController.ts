import { FastifyReply, FastifyRequest } from 'fastify';
import {
  postMultiplesClassesInTurnoBodyType,
  turnoBodyType,
  turnoParamsType,
} from '../schemas/turnoSchemas';
import {
  changeTurno,
  getTurno,
  getTurnoByInicioAndTermino,
  getTurnoByNome,
  getTurnoId,
  getTurnos,
  saveTurno,
} from '../services/turnoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utils';
import {
  createMultiplesClasseTurnoBasedOnTurnoId,
  getClasseTurnoById,
} from '../services/classeTurnoServices';
import { getClasseId } from '../services/classeServices';

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
  request: FastifyRequest<{ Body: turnoBodyType }>,
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

export async function updateTurnoController(
  request: FastifyRequest<{ Params: turnoParamsType; Body: turnoBodyType }>,
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

  const { turnoId } = request.params;

  const [isTurnoId, isTurnoNome, turno] = await Promise.all([
    await getTurnoId(turnoId),
    await getTurnoByNome(nome, turnoId),
    await getTurnoByInicioAndTermino(inicio, termino),
  ]);

  if (!isTurnoId) throwNotFoundTurno();
  if (isTurnoNome) throwTurnoNomeAlreadyExist();
  if (turno && turno.id !== turnoId) throwTurnoAlreadyExistBadRequest();

  const turnoUpdated = await changeTurno(turnoId, { nome, inicio, termino });
  return reply.send(turnoUpdated);
}

export async function getTurnoController(
  request: FastifyRequest<{ Params: turnoParamsType }>,
  reply: FastifyReply
) {
  const { turnoId } = request.params;

  const turno = await getTurno(turnoId);

  if (!turno) throwNotFoundTurno();
  return reply.send(turno);
}

export async function getTurnosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = await getTurnos();
  return reply.send({ data });
}

export async function createMultiplesClasseTurnoController(
  request: FastifyRequest<{
    Params: turnoParamsType;
    Body: postMultiplesClassesInTurnoBodyType;
  }>,
  reply: FastifyReply
) {
  const { turnoId } = request.params;
  const { classes } = request.body;

  const isTurnoId = await getTurnoId(turnoId);

  if (!isTurnoId) throwNotFoundTurno();

  // FIXME: VERIFY IF IN ARRAY EXIST DUPLICATED ENTRY
  for (let i = 0; i < classes.length; i++) {
    const classeId = classes[i];

    const [isClasseId, isClasseTurnoId] = await Promise.all([
      await getClasseId(classeId),
      await getClasseTurnoById(classeId, turnoId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids turnos
    if (!isClasseId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Classe inválida.',
        errors: {
          classes: {
            [i]: 'classeId não existe.',
          },
        },
      });
    }

    if (isClasseTurnoId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Classe inválida.',
        errors: {
          turnos: {
            [i]: 'classe Já está relacionada com o turno.',
          },
        },
      });
    }
  }

  const classeTurnos = await createMultiplesClasseTurnoBasedOnTurnoId(
    turnoId,
    classes
  );

  // TODO: SEND A BETTER RESPONSE
  return reply.status(HttpStatusCodes.CREATED).send(classeTurnos);
}
