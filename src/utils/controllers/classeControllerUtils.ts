import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwNotFoundClasseIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Classe não existe.',
  });
}

export function throwDuplicatedClasseError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Classe já existe.',
  });
}

export function throwDuplicatedClasseCursoOrdemError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Ordem inválida.',
    errors: {
      // TODO: melhorar a mensagem de erro
      ordem: ['Já existe uma classe com a mesma ordem.'],
    },
  });
}

export function throwNotFoundClasseIdFieldError(
  errorMessage = 'Classe não existe.',
  statusCode = HttpStatusCodes.NOT_FOUND
) {
  throw new BadRequest({
    statusCode,
    message: 'Classe inválida.',
    errors: {
      classeId: [errorMessage],
    },
  });
}
