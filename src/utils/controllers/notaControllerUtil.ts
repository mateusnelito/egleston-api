import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwDuplicatedNotaError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nota já existe.',
  });
}
