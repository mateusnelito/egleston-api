import { prisma } from '../lib/prisma';
import {
  createParentescoBodyType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';

export async function getParentescoNome(nome: string, id?: number) {
  const whereClause = id ? { id: { not: id }, nome } : { nome };
  return await prisma.parentesco.findFirst({
    where: whereClause,
    select: { nome: true },
  });
}

export async function getParentescoById(id: number) {
  return await prisma.parentesco.findUnique({ where: { id } });
}

export async function saveParentesco(data: createParentescoBodyType) {
  return await prisma.parentesco.create({ data });
}

export async function changeParentesco(
  id: number,
  data: updateParentescoBodyType
) {
  return await prisma.parentesco.update({ where: { id }, data });
}

// Return all parentesco on db
export async function getParentescos() {
  return await prisma.parentesco.findMany({ orderBy: { id: 'desc' } });
}
