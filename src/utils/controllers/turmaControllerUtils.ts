import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export function throwDuplicatedTurmaError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Turma já existe.',
  });
}

export function throwNotFoundTurmaIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Turma inválida.',
    errors: {
      turmaId: ['ID da turma não existe.'],
    },
  });
}

export function throwNotFoundTurmaIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da turma não existe.',
  });
}
