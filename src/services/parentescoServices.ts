import { prisma } from '../lib/prisma';
import {
  createParentescoBodyType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';

export async function getParentescoByNome(nome: string, id?: number) {
  if (id) {
    return await prisma.parentesco.findFirst({
      where: { id: { not: id }, nome },
      select: {
        id: true,
      },
    });
  }
  return await prisma.parentesco.findUnique({
    where: { nome },
    select: {
      id: true,
    },
  });
}

export async function getParentescoById(id: number) {
  return await prisma.parentesco.findUnique({ where: { id } });
}

export async function saveParentesco(parentesco: createParentescoBodyType) {
  return await prisma.parentesco.create({ data: parentesco });
}

export async function changeParentesco(
  id: number,
  parentesco: updateParentescoBodyType
) {
  return await prisma.parentesco.update({ where: { id }, data: parentesco });
}

export async function getParentescos(
  limit: number,
  cursor: number | null | undefined
) {
  // Applying cursor-based pagination
  if (cursor) {
    return await prisma.parentesco.findMany({
      where: {
        id: {
          // Load only parentescos where id is less than offset
          // Because the list start on last registry to first
          lt: cursor,
        },
      },
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });
  }

  return await prisma.parentesco.findMany({
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
