import BadRequest from '../utils/BadRequest';
import { throwNotFoundAnoLectivoIdFieldError } from '../utils/controllers/anoLectivoControllerUtils';
import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import { throwNotFoundCursoIdFieldError } from '../utils/controllers/cursoControllerUtils';
import { throwNotFoundTurmaIdFieldError } from '../utils/controllers/turmaControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { getAnoLectivoId } from './anoLectivoServices';
import { getClasseId } from './classeServices';
import { getCursoId } from './cursoServices';
import { getMetodoPagamentoById } from './metodoPagamentoServices';
import { getTurmaId } from './turmaServices';

interface matriculaDataInterface {
  classeId: number;
  cursoId: number;
  turmaId: number;
  anoLectivoId: number;
  metodoPagamentoId: number;
}

export async function validateMatriculaData(
  matriculaData: matriculaDataInterface
) {
  const { classeId, cursoId, turmaId, anoLectivoId, metodoPagamentoId } =
    matriculaData;

  const [classe, isCursoId, isTurmaId, isMetodoPagamentoId, isAnoLectivoId] =
    await Promise.all([
      getClasseId(classeId),
      getCursoId(cursoId),
      getTurmaId(turmaId),
      getMetodoPagamentoById(metodoPagamentoId),
      getAnoLectivoId(anoLectivoId),
    ]);

  if (!classe) throwNotFoundClasseIdFieldError();
  if (!isCursoId) throwNotFoundCursoIdFieldError();
  if (!isTurmaId) throwNotFoundTurmaIdFieldError();
  if (!isAnoLectivoId) throwNotFoundAnoLectivoIdFieldError();

  if (!isMetodoPagamentoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Metodo de pagamento inválido.',
      errors: {
        metodoPagamentoId: ['ID metodo de pagamento não existe.'],
      },
    });
  }
}
