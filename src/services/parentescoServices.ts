import { prisma } from '../lib/prisma';
import {
  createParentescoBodyType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';

export async function getParentescoByNome(nome: string) {
  return await prisma.parentesco.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function getParentescoId(id: number) {
  return await prisma.parentesco.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function createParentesco(data: createParentescoBodyType) {
  return await prisma.parentesco.create({ data });
}

export async function updateParentesco(
  id: number,
  data: updateParentescoBodyType
) {
  return await prisma.parentesco.update({ where: { id }, data });
}

export async function getParentescos() {
  return {
    data: await prisma.parentesco.findMany({ orderBy: { id: 'desc' } }),
  };
}

export async function getParentesco(id: number) {
  return await prisma.parentesco.findUnique({ where: { id } });
}
