import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwDuplicatedNotaError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nota já existe.',
  });
}

export function throwNotFoundNotaIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Nota não existe.',
  });
}
