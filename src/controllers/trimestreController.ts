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
import {
  MINIMUM_ANO_LECTIVO_TRIMESTRE,
  MINIMUM_TRIMESTRE_MONTH_DURATION,
} from '../utils/constants';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
  isDateBetweenDateIntervals,
  throwValidationError,
} from '../utils/utilsFunctions';

export async function createTrimestreController(
  request: FastifyRequest<{ Body: createTrimestreBodyType }>,
  reply: FastifyReply
) {
  const { numero, inicio, termino } = request.body;
  const trimestreMonths = calculateTimeBetweenDates(inicio, termino, 'M');

  // TODO: VERIFICAR SE O INICIO E FIM DO TRIMESTRE ESTÃO NO INTERVALO DE DURAÇÃO DO ANO LECTIVO

  if (trimestreMonths > MINIMUM_TRIMESTRE_MONTH_DURATION)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Trimestre inválido', {
      termino: [
        `A duração máxima do trimestre é de ${MINIMUM_TRIMESTRE_MONTH_DURATION} meses.`,
      ],
    });

  const activeAnoLectivo = await getAnoLectivoActivo();

  if (!activeAnoLectivo)
    throwValidationError(
      HttpStatusCodes.PRECONDITION_FAILED,
      'Nenhum ano lectivo activo encontrado.'
    );

  if (
    !isDateBetweenDateIntervals(
      inicio,
      activeAnoLectivo!.inicio,
      activeAnoLectivo!.termino
    )
  ) {
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Trimestre inválido', {
      inicio: [
        'Inicio de trimestre deve estar dentro da duração do ano-lectivo.',
      ],
    });
  }

  if (
    !isDateBetweenDateIntervals(
      termino,
      activeAnoLectivo!.inicio,
      activeAnoLectivo!.termino
    )
  ) {
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Trimestre inválido', {
      termino: [
        'Termino do trimestre deve estar dentro da duração do ano-lectivo.',
      ],
    });
  }

  const [trimestre, totalAnoLectivoTrimestre, lastAnoLectivoTrimestre] =
    await Promise.all([
      getTrimestreByUniqueKey(activeAnoLectivo!.id, numero),
      getTotalTrimestresInAnoLectivo(activeAnoLectivo!.id),
      getLastTrimestreAddedInAnoLectivo(activeAnoLectivo!.id),
    ]);

  if (trimestre)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Trimestre já existe.');

  if (totalAnoLectivoTrimestre >= MINIMUM_ANO_LECTIVO_TRIMESTRE)
    throwValidationError(
      HttpStatusCodes.FORBIDDEN,
      'Número máximo de trimestre atingido.'
    );

  if (
    lastAnoLectivoTrimestre &&
    isBeginDateAfterEndDate(lastAnoLectivoTrimestre.termino, inicio)
  )
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Trimestre inválido', {
      inicio: [
        'Inicio de trimestre não pôde ser anterior ao término do último trimestre.',
      ],
    });

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

  if (!activeAnoLectivo)
    throwValidationError(
      HttpStatusCodes.PRECONDITION_FAILED,
      'Nenhum ano lectivo activo encontrado.'
    );

  return reply.send(await getTrimestreByAnoLectivo(activeAnoLectivo!.id));
}

export async function getTrimestreController(
  request: FastifyRequest<{ Params: trimestreParamsType }>,
  reply: FastifyReply
) {
  const { trimestreId } = request.params;
  const trimestre = await getTrimestre(trimestreId);

  if (!trimestre)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Trimestre não encontrado');

  return reply.send(trimestre);
}
