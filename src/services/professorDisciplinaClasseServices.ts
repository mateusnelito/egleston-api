import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function getProfessorDisciplinaClasseById(
  professorId: number,
  disciplinaId: number,
  classeId: number,
  turmaId: number
) {
  return await prisma.professorDisciplinaClasse.findUnique({
    where: {
      professorId_disciplinaId_classeId_turmaId: {
        professorId,
        disciplinaId,
        classeId,
        turmaId,
      },
    },
  });
}

export async function createProfessorDisciplinaClasse(
  data: Prisma.ProfessorDisciplinaClasseUncheckedCreateInput
) {
  return await prisma.professorDisciplinaClasse.create({ data });
}

export async function getTotalProfessorDisciplina(
  professorId: number,
  classeId: number,
  turmaId: number
) {
  return await prisma.professorDisciplinaClasse.count({
    where: { professorId, classeId, turmaId },
  });
}
