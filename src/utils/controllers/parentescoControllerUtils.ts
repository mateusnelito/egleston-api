import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export function throwNotFoundParentescoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Parentesco inválido.',
    errors: { parentescoId: ['parentescoId não existe.'] },
  });
}

export function throwNotFoundParentescoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID de parentesco não existe.',
  });
}

export function throwDuplicatedParentescoNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de parentesco inválido.',
    errors: { nome: ['O nome de parentesco já existe.'] },
  });
}
