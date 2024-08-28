import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export function throwNotFoundClasseIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da classe não existe.',
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

export function throwDuplicatedClasseError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Classe já existe.',
  });
}
