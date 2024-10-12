import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export const MINIMUM_ALUNO_AGE = 14;
export const MINIMUM_ALUNO_RESPONSAVEIS = 4;

export function throwNotFoundAlunoIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Aluno não existe.',
  });
}

export function throwInvalidAlunoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Aluno inválido.',
    errors: {
      alunoId: ['id de aluno não existe.'],
    },
  });
}
