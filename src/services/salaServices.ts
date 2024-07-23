import { prisma } from '../lib/prisma';
import { postSalaBodyType } from '../schemas/salaSchemas';

export async function getSalaNome(nome: string) {
  return await prisma.sala.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function saveSala(data: postSalaBodyType) {
  return await prisma.sala.create({ data });
}
