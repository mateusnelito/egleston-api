import { prisma } from '../lib/prisma';
import { createSalaBodyType } from '../schemas/salaSchemas';

export async function getSalaByNome(nome: string) {
  return await prisma.sala.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function createSala(data: createSalaBodyType) {
  return await prisma.sala.create({ data });
}

export async function getSalaId(id: number) {
  return await prisma.sala.findUnique({ where: { id }, select: { id: true } });
}

export async function updateSala(id: number, data: createSalaBodyType) {
  return await prisma.sala.update({
    where: { id },
    data,
  });
}

export async function getSala(id: number) {
  return await prisma.sala.findUnique({ where: { id } });
}

export async function getSalas() {
  return {
    data: await prisma.sala.findMany({
      select: { id: true, nome: true },
      orderBy: { id: 'desc' },
    }),
  };
}
