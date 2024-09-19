import { prisma } from '../lib/prisma';
import { formatDate } from '../utils/utilsFunctions';

export async function getDisciplinaProfessor(
  professorId: number,
  disciplinaId: number
) {
  return await prisma.disciplinasProfessores.findUnique({
    where: { disciplinaId_professorId: { professorId, disciplinaId } },
  });
}

export async function getProfessorDisciplinas(professorId: number) {
  const professorDisciplinas = await prisma.disciplinasProfessores.findMany({
    where: { professorId },
    select: {
      Disciplina: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });
  return {
    data: professorDisciplinas.map(({ Disciplina: disciplina }) => {
      return {
        id: disciplina.id,
        nome: disciplina.nome,
      };
    }),
  };
}

export async function createMultiplesDisciplinaProfessorByProfessor(
  professorId: number,
  disciplinas: Array<number>
) {
  const createManyDisciplinaProfessorPromise =
    prisma.disciplinasProfessores.createMany({
      data: disciplinas.map((disciplinaId) => {
        return {
          professorId,
          disciplinaId,
        };
      }),
    });

  const findProfessorPromise = prisma.professor.findUnique({
    where: { id: professorId },
  });

  const [{ count: totalProfessorDisciplina }, professor] = await Promise.all([
    createManyDisciplinaProfessorPromise,
    findProfessorPromise,
  ]);

  if (professor) {
    return {
      id: professor.id,
      nomeCompleto: professor.nomeCompleto,
      dataNascimento: formatDate(professor.dataNascimento),
      disciplinas: totalProfessorDisciplina,
    };
  }
  return professor;
}

export async function deleteDisciplinaProfessor(
  professorId: number,
  disciplinaId: number
) {
  return await prisma.disciplinasProfessores.delete({
    where: { disciplinaId_professorId: { professorId, disciplinaId } },
  });
}

export async function deleteMultiplesDisciplinaProfessorByProfessor(
  professorId: number,
  disciplinas: Array<number>
) {
  const deleteDisciplinaProfessorArrayPromises = disciplinas.map(
    (disciplinaId) => {
      return prisma.disciplinasProfessores.delete({
        where: {
          disciplinaId_professorId: {
            professorId,
            disciplinaId,
          },
        },
      });
    }
  );

  return await Promise.all(deleteDisciplinaProfessorArrayPromises);
}
