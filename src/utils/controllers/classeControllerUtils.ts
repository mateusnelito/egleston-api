import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export function throwNotFoundClasseIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da classe não existe.',
  });
}

export function throwDuplicatedClasseError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Classe já existe.',
  });
}

export function throwNotFoundClasseIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Classe inválida.',
    errors: {
      classeId: ['ID da classe não existe.'],
    },
  });
}
