import { prisma } from '../lib/prisma';
import { formatDate } from '../utils/utils';

export async function checkDisciplinaProfessorAssociation(
  professorId: number,
  disciplinaId: number
) {
  return await prisma.disciplinasProfessores.findUnique({
    where: { disciplinaId_professorId: { professorId, disciplinaId } },
  });
}

export async function associateDisciplinasWithProfessor(
  professorId: number,
  disciplinas: Array<number>
) {
  for (const disciplinaId of disciplinas) {
    await prisma.disciplinasProfessores.create({
      data: { professorId, disciplinaId },
    });
  }
  const professor = await prisma.professor.findUnique({
    where: { id: professorId },
    select: {
      id: true,
      nomeCompleto: true,
      dataNascimento: true,
      DisciplinasProfessores: {
        select: { disciplinaId: true },
      },
    },
  });

  // Gambiarra 'cause professor always exist in this point of program
  // FIXME: Find a better way to handle the serialization error
  if (professor) {
    return {
      nomeCompleto: professor.nomeCompleto,
      dataNascimento: formatDate(professor.dataNascimento),
      disciplinas: professor.DisciplinasProfessores.map((disciplina) => {
        return disciplina.disciplinaId;
      }),
    };
  }
}

export async function associateProfessoresWithDisciplina(
  disciplinaId: number,
  professores: Array<number>
) {
  for (const professorId of professores) {
    await prisma.disciplinasProfessores.create({
      data: { disciplinaId, professorId },
    });
  }
}

export async function deleteDisciplinaProfessor(
  professorId: number,
  disciplinaId: number
) {
  return await prisma.disciplinasProfessores.delete({
    where: { disciplinaId_professorId: { professorId, disciplinaId } },
  });
}

export async function deleteDisciplinasWithProfessorAssociation(
  professorId: number,
  disciplinas: Array<number>
) {
  for (const disciplinaId of disciplinas) {
    await prisma.disciplinasProfessores.delete({
      where: { disciplinaId_professorId: { professorId, disciplinaId } },
    });
  }
}
