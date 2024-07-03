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

export async function associateCursoWithDisciplinas(
  id: number,
  disciplinas: Array<number>
) {
  for (const disciplina of disciplinas) {
    await prisma.cursosDisciplinas.create({
      data: { cursoId: id, disciplinaId: disciplina },
    });
  }
}
