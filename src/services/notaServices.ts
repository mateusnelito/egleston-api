import { prisma } from '../lib/prisma';
import { notaDataType } from '../schemas/notaSchema';
import { throwInvalidAlunoIdFieldError } from '../utils/controllers/alunoControllerUtils';
import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import { throwInvalidDisciplinaIdFieldError } from '../utils/controllers/disciplinaControllerUtils';
import { throwInvalidTrimestreIdFieldError } from '../utils/controllers/trimestreControllerUtils';
import { notaIdDataType, validateNotaDataType } from '../utils/interfaces';
import { getAlunoId } from './alunoServices';
import { getClasseId } from './classeServices';
import { getDisciplinaId } from './disciplinaServices';
import { getTrimestreId } from './trimestreServices';

export async function validateNotaData(data: validateNotaDataType) {
  const { alunoId, classeId, disciplinaId, trimestreId } = data;

  const [aluno, classe, disciplina, trimestre] = await Promise.all([
    alunoId ? getAlunoId(alunoId) : null,
    getClasseId(classeId),
    getDisciplinaId(disciplinaId),
    getTrimestreId(trimestreId),
  ]);

  if (alunoId && !aluno) throwInvalidAlunoIdFieldError();

  if (!classe) throwNotFoundClasseIdFieldError();

  if (!disciplina) throwInvalidDisciplinaIdFieldError('Disciplina não existe');

  if (!trimestre) throwInvalidTrimestreIdFieldError();
}

export async function getNotaById(data: notaIdDataType) {
  return await prisma.nota.findUnique({
    where: { alunoId_classeId_disciplinaId_trimestreId: data },
    select: { nota: true },
  });
}

export async function createNota(data: notaDataType) {
  return await prisma.nota.create({ data });
}
