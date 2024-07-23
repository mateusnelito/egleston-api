import { prisma } from '../lib/prisma';
import { postSalaBodyType } from '../schemas/salaSchemas';

export async function getSalaByNome(nome: string) {
  return await prisma.sala.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function saveSala(data: postSalaBodyType) {
  return await prisma.sala.create({ data });
}

export async function getSalaId(id: number) {
  return await prisma.sala.findUnique({ where: { id }, select: { id: true } });
}

export async function changeSala(id: number, data: postSalaBodyType) {
  return await prisma.sala.update({
    where: { id },
    data,
    select: { nome: true, capacidade: true, localizacao: true },
  });
}

export async function getSala(id: number) {
  return await prisma.sala.findUnique({ where: { id } });
}

export async function getSalas() {
  return await prisma.sala.findMany({
    select: { id: true, nome: true },
    orderBy: { id: 'desc' },
  });
}
