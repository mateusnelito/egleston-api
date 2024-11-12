import HttpStatusCodes from '../utils/HttpStatusCodes';
import { matriculaCreateDataInterface } from '../utils/interfaces';
import { throwValidationError } from '../utils/utilsFunctions';
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

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe inválida.', {
      classeId: ['Classe não encontrada'],
    });

  if (!metodoPagamento)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Metodo de pagamento inválido.',
      { metodoPagamentoId: ['Metodo de pagamento não encontrado.'] }
    );

  const classeTurma = await isTurmaInClasse(turmaId, classeId);

  if (!classeTurma)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turma inválida.', {
      turmaId: ['Turma não associada a classe.'],
    });

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
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Turma inválida.', {
      turmaId: ['Limite máximo de alunos atingido.'],
    });
}
