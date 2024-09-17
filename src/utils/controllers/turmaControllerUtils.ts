import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwDuplicatedTurmaError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turma já existe.',
  });
}

export function throwNotFoundTurmaIdFieldError(
  errorMessage = 'Turma não existe.',
  statusCode = HttpStatusCodes.NOT_FOUND
) {
  throw new BadRequest({
    statusCode,
    message: 'Turma inválida.',
    errors: {
      turmaId: [errorMessage],
    },
  });
}

export function throwNotFoundTurmaIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Turma não existe.',
  });
}
