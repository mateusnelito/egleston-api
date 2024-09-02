import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export function throwNotFoundCursoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Curso inválido',
    errors: { cursoId: ['ID do curso não existe.'] },
  });
}

export function throwNotFoundCursoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID de curso não existe.',
  });
}

export function throwDuplicatedCursoError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de curso inválido.',
    errors: { nome: ['O nome de curso já existe.'] },
  });
}

export function throwDuplicatedDisciplinaIdInArrayError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Disciplinas inválidas.',
    errors: {
      disciplinas: 'o array de disciplinas não podem conter items duplicados.',
    },
  });
}

export function throwInvalidCursoIdInArrayError(
  index: number,
  message: string,
  statusCode: number = HttpStatusCodes.NOT_FOUND
) {
  throw new BadRequest({
    statusCode,
    message: 'Curso inválido.',
    errors: {
      disciplinas: {
        [index]: message,
      },
    },
  });
}
