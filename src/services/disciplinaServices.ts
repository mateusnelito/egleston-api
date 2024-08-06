import { prisma } from '../lib/prisma';
import { createDisciplinaBodyType } from '../schemas/disciplinaSchema';

export async function getDisciplinaNome(nome: string) {
  return await prisma.disciplina.findFirst({
    where: { nome },
    select: { id: true },
  });
}

export async function getDisciplinaId(id: number) {
  return await prisma.disciplina.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function getDisciplina(id: number) {
  return await prisma.disciplina.findUnique({ where: { id } });
}

export async function createDisciplina(data: createDisciplinaBodyType) {
  return await prisma.disciplina.create({ data });
}

export async function updateDisciplina(
  id: number,
  data: createDisciplinaBodyType
) {
  return await prisma.disciplina.update({ where: { id }, data });
}

export async function getDisciplinas(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor ? { id: { lt: cursor } } : {};
  return await prisma.disciplina.findMany({
    where: whereClause,
    select: {
      id: true,
      nome: true,
    },
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
