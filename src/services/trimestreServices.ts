import { prisma } from '../lib/prisma';

export async function getTotalTrimestresInAnoLectivo(anoLectivoId: number) {
  return await prisma.trimestre.count({ where: { anoLectivoId } });
}

export async function getLastTrimestreAddedInAnoLectivo(anoLectivoId: number) {
  return await prisma.trimestre.findFirst({
    where: { anoLectivoId },
    orderBy: { id: 'asc' },
  });
}
