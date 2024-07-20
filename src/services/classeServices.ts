import { prisma } from '../lib/prisma';

export async function getClasseByCompostUniqueKey(
  nome: string,
  anoLectivoId: number,
  cursoId: number
) {
  return await prisma.classe.findUnique({
    where: {
      nome_anoLectivoId_cursoId: { nome, anoLectivoId, cursoId },
    },
    select: { id: true },
  });
}
