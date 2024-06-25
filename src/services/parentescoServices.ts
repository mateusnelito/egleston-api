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

export async function getParentescos(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor ? { id: { lt: cursor } } : {};
  return await prisma.parentesco.findMany({
    where: whereClause,
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
