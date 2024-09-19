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

// TO-REMEMBER: THIS IS THE PURE *GAMBIARRA WHE DB-DESIGN FAILS
export async function getProfessorClasses(professorId: number) {
  const professorClasses = await prisma.professorDisciplinaClasse.findMany({
    where: { professorId },
    distinct: ['classeId'],
    select: {
      Classe: {
        select: {
          id: true,
          nome: true,
          Curso: {
            select: {
              id: true,
              nome: true,
            },
          },
          AnoLectivo: {
            select: {
              activo: true,
            },
          },
        },
      },
    },
    orderBy: { Classe: { Curso: { nome: 'asc' } } },
  });

  const classes = professorClasses
    .filter(({ Classe: classe }) => classe.AnoLectivo.activo)
    .map(({ Classe: classe }) => {
      return {
        id: classe.id,
        nome: classe.nome,
        curso: {
          id: classe.Curso.id,
          nome: classe.Curso.nome,
        },
      };
    });

  return { data: classes };
}

export async function getDisciplinaClasse(
  disciplinaId: number,
  classeId: number,
  turmaId: number
) {
  return await prisma.professorDisciplinaClasse.findFirst({
    where: { disciplinaId, classeId, turmaId },
    select: { professorId: true },
  });
}
