import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import { throwNotFoundCursoIdFieldError } from '../utils/controllers/cursoControllerUtils';
import { throwNotFoundMetodoPagamentoIdFieldError } from '../utils/controllers/metodoPagamentoControllerUtils';
import { throwNotFoundTurmaIdFieldError } from '../utils/controllers/turmaControllerUtils';
import { matriculaCreateDataInterface } from '../utils/interfaces';
import { getClasseId } from './classeServices';
import { getCursoId } from './cursoServices';
import { getMetodoPagamentoById } from './metodoPagamentoServices';
import { getTurmaId } from './turmaServices';

export async function validateMatriculaData(
  matriculaData: matriculaCreateDataInterface
) {
  const { classeId, cursoId, turmaId, metodoPagamentoId } = matriculaData;

  const [classe, isCursoId, isTurmaId, isMetodoPagamentoId] = await Promise.all(
    [
      getClasseId(classeId),
      cursoId ? getCursoId(cursoId) : null,
      getTurmaId(turmaId),
      getMetodoPagamentoById(metodoPagamentoId),
    ]
  );

  if (!classe) throwNotFoundClasseIdFieldError();
  if (cursoId && !isCursoId) throwNotFoundCursoIdFieldError();
  if (!isTurmaId) throwNotFoundTurmaIdFieldError();
  if (!isMetodoPagamentoId) throwNotFoundMetodoPagamentoIdFieldError();
}
