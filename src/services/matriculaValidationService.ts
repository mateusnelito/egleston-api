import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import { throwNotFoundMetodoPagamentoIdFieldError } from '../utils/controllers/metodoPagamentoControllerUtils';
import { throwNotFoundTurmaIdFieldError } from '../utils/controllers/turmaControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { matriculaCreateDataInterface } from '../utils/interfaces';
import { getClasseId } from './classeServices';
import { getTotalMatriculas } from './matriculaServices';
import { getMetodoPagamentoById } from './metodoPagamentoServices';
import { getTurmaSala, isTurmaInClasse } from './turmaServices';

export async function validateMatriculaData(
  matriculaData: matriculaCreateDataInterface
) {
  const { classeId, turmaId, metodoPagamentoId } = matriculaData;

  const [classe, metodoPagamento] = await Promise.all([
    getClasseId(classeId),
    getMetodoPagamentoById(metodoPagamentoId),
  ]);

  if (!classe) throwNotFoundClasseIdFieldError();
  if (!metodoPagamento) throwNotFoundMetodoPagamentoIdFieldError();

  const classeTurma = await isTurmaInClasse(turmaId, classeId);

  if (!classeTurma)
    throwNotFoundTurmaIdFieldError(
      'Turma não associada a classe',
      HttpStatusCodes.BAD_REQUEST
    );

  await validateTurmaAlunosLimit(classeId, turmaId);
}

export async function validateTurmaAlunosLimit(
  classeId: number,
  turmaId: number
) {
  const [turmaSala, totalMatriculas] = await Promise.all([
    getTurmaSala(turmaId),
    getTotalMatriculas(classeId, turmaId),
  ]);

  // TODO: PENSAR EM UMA MANEIRA MELHOR DE RESOLVER ISSO
  if (!turmaSala)
    throw new Error('Sala não encontrada!', {
      cause:
        'Sala correspondente a turma não encontrada no banco de dados, ao validar matricula.',
    });

  if (totalMatriculas >= turmaSala.sala!.capacidade)
    throwNotFoundTurmaIdFieldError(
      'Limite máximo de alunos atingido.',
      HttpStatusCodes.FORBIDDEN
    );
}
