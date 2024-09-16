import { FastifyReply, FastifyRequest } from 'fastify';
import { createTrimestreBodyType } from '../schemas/trimestreSchemas';
import { getAnoLectivoActivo } from '../services/anoLectivoServices';
import {
  createTrimestre,
  getLastTrimestreAddedInAnoLectivo,
  getTotalTrimestresInAnoLectivo,
  getTrimestreByUniqueKey,
} from '../services/trimestreServices';
import { throwActiveAnoLectivoNotFoundError } from '../utils/controllers/anoLectivoControllerUtils';
import {
  MINIMUM_ANO_LECTIVO_TRIMESTRE,
  MINIMUM_TRIMESTRE_MONTH_DURATION,
  throwDuplicatedTrimestreError,
  throwInvalidTrimestreDurationError,
  throwInvalidTrimestreInicioError,
  throwMinimumAnoLectivoReachedError,
} from '../utils/controllers/trimestreControllerUtils';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
} from '../utils/utilsFunctions';

export async function createTrimestreController(
  request: FastifyRequest<{ Body: createTrimestreBodyType }>,
  reply: FastifyReply
) {
  const { numero, inicio, termino } = request.body;
  const trimestreMonths = calculateTimeBetweenDates(inicio, termino, 'M');

  if (trimestreMonths > MINIMUM_TRIMESTRE_MONTH_DURATION)
    throwInvalidTrimestreDurationError();

  const activeAnoLectivo = await getAnoLectivoActivo(true);

  if (!activeAnoLectivo) throwActiveAnoLectivoNotFoundError();

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

  return reply.send(newTrimestre);
}