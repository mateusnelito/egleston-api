import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createTrimestreBodyType,
  trimestreParamsType,
} from '../schemas/trimestreSchemas';
import { getAnoLectivoActivo } from '../services/anoLectivoServices';
import {
  createTrimestre,
  getLastTrimestreAddedInAnoLectivo,
  getTotalTrimestresInAnoLectivo,
  getTrimestre,
  getTrimestreByAnoLectivo,
  getTrimestreByUniqueKey,
} from '../services/trimestreServices';
import { throwActiveAnoLectivoNotFoundError } from '../utils/controllers/anoLectivoControllerUtils';
import {
  MINIMUM_ANO_LECTIVO_TRIMESTRE,
  MINIMUM_TRIMESTRE_MONTH_DURATION,
  throwDuplicatedTrimestreError,
  throwInvalidTrimestreDurationError,
  throwInvalidTrimestreInicioError,
  throwInvalidTrimestreTerminoError,
  throwMinimumAnoLectivoReachedError,
  throwNotFoundTrimestreIdError,
} from '../utils/controllers/trimestreControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
  isDateBetweenDateIntervals,
} from '../utils/utilsFunctions';

export async function createTrimestreController(
  request: FastifyRequest<{ Body: createTrimestreBodyType }>,
  reply: FastifyReply
) {
  const { numero, inicio, termino } = request.body;
  const trimestreMonths = calculateTimeBetweenDates(inicio, termino, 'M');

  // TODO: VERIFICAR SE O INICIO E FIM DO TRIMESTRE ESTÃO NO INTERVALO DE DURAÇÃO DO ANO LECTIVO

  if (trimestreMonths > MINIMUM_TRIMESTRE_MONTH_DURATION)
    throwInvalidTrimestreDurationError();

  const activeAnoLectivo = await getAnoLectivoActivo();

  if (!activeAnoLectivo) throwActiveAnoLectivoNotFoundError();

  if (
    !isDateBetweenDateIntervals(
      inicio,
      activeAnoLectivo!.inicio,
      activeAnoLectivo!.termino
    )
  ) {
    throwInvalidTrimestreInicioError(
      'O inicio do trimestre deve estar dentro da duração do ano-lectivo.'
    );
  }

  if (
    !isDateBetweenDateIntervals(
      termino,
      activeAnoLectivo!.inicio,
      activeAnoLectivo!.termino
    )
  ) {
    throwInvalidTrimestreTerminoError();
  }

  const [trimestre, totalAnoLectivoTrimestre, lastAnoLectivoTrimestre] =
    await Promise.all([
      getTrimestreByUniqueKey(activeAnoLectivo!.id, numero),
      getTotalTrimestresInAnoLectivo(activeAnoLectivo!.id),
      getLastTrimestreAddedInAnoLectivo(activeAnoLectivo!.id),
    ]);

  if (trimestre) throwDuplicatedTrimestreError();

  if (totalAnoLectivoTrimestre >= MINIMUM_ANO_LECTIVO_TRIMESTRE)
    throwMinimumAnoLectivoReachedError();

  if (
    lastAnoLectivoTrimestre &&
    isBeginDateAfterEndDate(lastAnoLectivoTrimestre.termino, inicio)
  )
    throwInvalidTrimestreInicioError();

  const newTrimestre = await createTrimestre({
    numero,
    anoLectivoId: activeAnoLectivo!.id,
    inicio,
    termino,
  });

  return reply.status(HttpStatusCodes.CREATED).send(newTrimestre);
}

export async function getTrimestresController(
  _: FastifyRequest,
  reply: FastifyReply
) {
  const activeAnoLectivo = await getAnoLectivoActivo();

  if (!activeAnoLectivo) throwActiveAnoLectivoNotFoundError();

  return reply.send(await getTrimestreByAnoLectivo(activeAnoLectivo!.id));
}

export async function getTrimestreController(
  request: FastifyRequest<{ Params: trimestreParamsType }>,
  reply: FastifyReply
) {
  const { trimestreId } = request.params;
  const trimestre = await getTrimestre(trimestreId);

  if (!trimestre) throwNotFoundTrimestreIdError();

  return reply.send(trimestre);
}
