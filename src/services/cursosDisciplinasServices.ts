import { prisma } from '../lib/prisma';

export async function checkCursoDisciplinaAssociation(
  cursoId: number,
  disciplinaId: number
) {
  return await prisma.cursosDisciplinas.findUnique({
    where: {
      cursoId_disciplinaId: { cursoId, disciplinaId },
    },
  });
}

export async function associateDisciplinasWithCurso(
  cursoId: number,
  disciplinas: Array<number>
) {
  for (const disciplinaId of disciplinas) {
    await prisma.cursosDisciplinas.create({
      data: { cursoId, disciplinaId },
    });
  }
}

export async function associateCursosWithDisciplina(
  disciplinaId: number,
  cursos: Array<number>
) {
  for (const cursoId of cursos) {
    await prisma.cursosDisciplinas.create({
      data: { disciplinaId, cursoId },
    });
  }
}

export async function deleteCursoDisciplina(
  cursoId: number,
  disciplinaId: number
) {
  return await prisma.cursosDisciplinas.delete({
    where: {
      cursoId_disciplinaId: { cursoId, disciplinaId },
    },
  });
}

export async function deleteDisciplinasWithCursoAssociation(
  cursoId: number,
  disciplinas: Array<number>
) {
  for (const disciplinaId of disciplinas) {
    await prisma.cursosDisciplinas.delete({
      where: { cursoId_disciplinaId: { cursoId, disciplinaId } },
    });
  }
}
