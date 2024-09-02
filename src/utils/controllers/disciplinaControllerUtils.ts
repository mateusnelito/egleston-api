import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export function throwNotFoundDisciplinaIdInArrayError(
  index: number,
  message: string,
  statusCode: number = HttpStatusCodes.NOT_FOUND
) {
  throw new BadRequest({
    statusCode,
    message: 'Disciplina inválida.',
    errors: {
      disciplinas: {
        [index]: message,
      },
    },
  });
}

export function throwNotFoundDisciplinaIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da disciplina não existe.',
  });
}

export function throwDuplicatedDisciplinaNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome da disciplina inválido.',
    errors: { nome: ['O nome da disciplina já existe.'] },
  });
}

export function throwInvalidDisciplinasArrayError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Disciplinas inválidas.',
    errors: {
      disciplinas: 'O array de disciplinas não podem conter items duplicados.',
    },
  });
}
