import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwNotFoundCursoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Curso inválido',
    errors: { cursoId: ['Curso não existe.'] },
  });
}

export function throwNotFoundCursoIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Curso não existe.',
  });
}

export function throwDuplicatedCursoNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de curso inválido.',
    errors: { nome: ['O nome de curso já existe.'] },
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
