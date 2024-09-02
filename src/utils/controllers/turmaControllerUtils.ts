import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

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
