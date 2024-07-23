import { prisma } from '../lib/prisma';

export async function getTurnoByNome(nome: string) {
  return await prisma.turno.findUnique({
    where: { nome },
    select: { id: true },
  });
}
