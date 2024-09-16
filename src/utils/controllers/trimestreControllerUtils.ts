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

export function throwInvalidTrimestreInicioError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Inicio de trimestre inválido.',
    errors: {
      inicio: [
        'O inicio do trimestre não pôde ser anterior ao término do trimestre anterior.',
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
