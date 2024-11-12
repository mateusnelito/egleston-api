import { prisma } from '../lib/prisma';
import { getAlunoNotasQueryStringType } from '../schemas/alunoSchemas';
import { notaDataType } from '../schemas/notaSchema';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { notaIdDataType, validateNotaDataType } from '../utils/interfaces';
import { throwValidationError } from '../utils/utilsFunctions';
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

  if (alunoId && !aluno)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Aluno inválido.', {
      alunoId: ['Aluno não encontrado'],
    });

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe inválida.', {
      classeId: ['Classe não encontrada'],
    });

  if (!disciplina)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Disciplina inválida.', {
      disciplinaId: ['Disciplina não encontrada'],
    });

  if (!trimestre)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Trimestre inválido.', {
      trimestreId: ['Trimestre não encontrado'],
    });
}

export async function getNotaById(data: notaIdDataType) {
  return await prisma.nota.findUnique({
    where: { alunoId_classeId_disciplinaId_trimestreId: data },
    select: { nota: true },
  });
}

export async function createNota(data: notaDataType) {
  const nota = await prisma.nota.create({ data });

  return {
    alunoId: nota.alunoId,
    classeId: nota.classeId,
    disciplinaId: nota.disciplinaId,
    trimestreId: nota.trimestreId,
    nota: Number(nota.nota),
  };
}

export async function updateNota(data: notaDataType) {
  const {
    alunoId,
    classeId,
    disciplinaId,
    trimestreId,
    nota: notaValue,
  } = data;

  const nota = await prisma.nota.update({
    where: {
      alunoId_classeId_disciplinaId_trimestreId: {
        alunoId,
        classeId,
        disciplinaId,
        trimestreId,
      },
    },
    data: { nota: notaValue },
  });

  // TODO: ADD FUN TO DO THIS DYNAMICALLY
  return {
    alunoId: nota.alunoId,
    classeId: nota.classeId,
    disciplinaId: nota.disciplinaId,
    trimestreId: nota.trimestreId,
    nota: Number(nota.nota),
  };
}

export async function getAlunoNotas(
  alunoId: number,
  params: getAlunoNotasQueryStringType
) {
  const { classeId, trimestreId } = params;
  const notas = await prisma.nota.findMany({
    where: { alunoId, trimestreId, classeId },
    select: {
      nota: true,
      Trimestre: {
        select: { numero: true },
      },
      Disciplina: {
        select: { nome: true },
      },
    },
  });

  return {
    data: notas.map((nota) => ({
      trimestre: nota.Trimestre.numero,
      disciplina: nota.Disciplina.nome,
      nota: Number(nota.nota),
    })),
  };
}
