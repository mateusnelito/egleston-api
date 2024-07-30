import { prisma } from '../lib/prisma';

export async function getClasseTurnoById(classeId: number, turnoId: number) {
  return await prisma.classeTurno.findUnique({
    where: { classeId_turnoId: { classeId, turnoId } },
  });
}
