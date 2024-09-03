import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwNotFoundParentescoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Parentesco inválido.',
    errors: { parentescoId: ['Parentesco não existe.'] },
  });
}

export function throwNotFoundParentescoIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Parentesco não existe.',
  });
}

export function throwDuplicatedParentescoNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de parentesco inválido.',
    errors: { nome: ['O nome de parentesco já existe.'] },
  });
}
