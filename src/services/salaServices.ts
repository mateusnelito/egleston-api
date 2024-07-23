import { prisma } from '../lib/prisma';

export async function getSalaNome(nome: string) {
  return await prisma.sala.findUnique({
    where: { nome },
    select: { nome: true },
  });
}
