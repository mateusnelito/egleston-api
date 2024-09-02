import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

// Controller const
export const TURNO_BASE_DATE = '2024-07-24';
export const MAXIMUM_DURATION_HOURS = 8;
export const MINIMUM_DURATION_HOURS = 1;

export function throwNotFoundTurnoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Turno inválido',
    errors: { turnoId: 'ID do turno não existe.' },
  });
}

export function throwInvalidTurnosArrayError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turnos inválidos.',
    errors: {
      turnos: ['turnos não podem conter items duplicados.'],
    },
  });
}

export function throwDuplicatedTurnoNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

export function throwInvalidTurnoInicioError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Hora de início inválida.',
    errors: { inicio: ['Início não pode ser após o término.'] },
  });
}

export function throwDuplicatedTurnoError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turno já existe.',
  });
}

export function throwNotFoundTurnoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do turno não existe.',
  });
}

export function throwInvalidTurnoDurationError(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message,
  });
}
