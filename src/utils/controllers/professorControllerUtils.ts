import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export const MAXIMUM_PROFESSOR_DISCIPLINA_CLASSE = 2;
export const MAXIMUM_PROFESSOR_AGE = 80;

export function throwNotFoundProfessorIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Professor não existe.',
  });
}
