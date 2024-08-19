import BadRequest from '../utils/BadRequest';
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

  if (!classe) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Classe inválida.',
      errors: {
        classeId: ['ID da classe não existe.'],
      },
    });
  }

  if (!isCursoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Curso inválido.',
      errors: {
        cursoId: ['ID do curso não existe.'],
      },
    });
  }

  if (!isTurmaId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Turma inválida.',
      errors: {
        turmaId: ['ID da turma não existe.'],
      },
    });
  }

  if (!isAnoLectivoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Ano lectivo inválido.',
      errors: {
        anoLectivoId: ['ID do ano lectivo não existe.'],
      },
    });
  }

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
