import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import { throwNotFoundCursoIdFieldError } from '../utils/controllers/cursoControllerUtils';
import { throwNotFoundMetodoPagamentoIdFieldError } from '../utils/controllers/metodoPagamentoControllerUtils';
import { throwNotFoundTurmaIdFieldError } from '../utils/controllers/turmaControllerUtils';
import { throwNotFoundTurnoIdFieldError } from '../utils/controllers/turnoControllerUtils';
import { matriculaCreateDataInterface } from '../utils/interfaces';
import { getClasseId } from './classeServices';
import { getCursoId } from './cursoServices';
import { getMetodoPagamentoById } from './metodoPagamentoServices';
import { getTurmaId } from './turmaServices';
import { getTurnoId } from './turnoServices';

export async function validateMatriculaData(
  matriculaData: matriculaCreateDataInterface
) {
  const { classeId, cursoId, turmaId, turnoId, metodoPagamentoId } =
    matriculaData;

  const [classe, isCursoId, isTurmaId, isTurnoId, isMetodoPagamentoId] =
    await Promise.all([
      getClasseId(classeId),
      getCursoId(cursoId),
      getTurmaId(turmaId),
      getTurnoId(turnoId),
      getMetodoPagamentoById(metodoPagamentoId),
    ]);

  if (!classe) throwNotFoundClasseIdFieldError();
  if (!isCursoId) throwNotFoundCursoIdFieldError();
  if (!isTurmaId) throwNotFoundTurmaIdFieldError();
  if (!isTurnoId) throwNotFoundTurnoIdFieldError();
  if (!isMetodoPagamentoId) throwNotFoundMetodoPagamentoIdFieldError();
}
