import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export const MINIMUM_ANO_LECTIVO_TRIMESTRE = 3;

// TODO: SET TO 3.5 IF ITS POSSIBLY
export const MINIMUM_TRIMESTRE_MONTH_DURATION = 4;

export function throwMinimumAnoLectivoReachedError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Número máximo de trimestre atingido.',
  });
}

export function throwInvalidTrimestreInicioError(
  message = 'O inicio do trimestre não pôde ser anterior ao término do último trimestre.'
) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Inicio de trimestre inválido.',
    errors: {
      inicio: [message],
    },
  });
}

export function throwInvalidTrimestreTerminoError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Termino de trimestre inválido.',
    errors: {
      termino: [
        'O termino do trimestre deve estar dentro da duração do ano-lectivo.',
      ],
    },
  });
}

export function throwInvalidTrimestreDurationError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'A duração de trimestre inválida.',
    errors: {
      termino: [
        `A duração máxima do trimestre é de ${MINIMUM_TRIMESTRE_MONTH_DURATION} meses.`,
      ],
    },
  });
}

export function throwDuplicatedTrimestreError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Trimestre já existe.',
  });
}

export function throwNotFoundTrimestreIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Trimestre não existe.',
  });
}
