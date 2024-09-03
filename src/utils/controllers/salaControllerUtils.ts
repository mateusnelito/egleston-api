import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwNotFoundSalaIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Sala inválida',
    errors: { salaId: 'ID da sala não existe.' },
  });
}

export function throwNotFoundSalaIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Sala não existe.',
  });
}

export function throwDuplicatedSalaNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome da sala já existe.'] },
  });
}
