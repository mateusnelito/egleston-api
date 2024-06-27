import { prisma } from '../lib/prisma';
import { createDisciplinaBodyType } from '../schemas/disciplinaSchema';

export async function getDisciplinaNome(nome: string, id?: number) {
  const whereClause = id ? { id: { not: id }, nome } : { nome };
  return await prisma.disciplina.findFirst({
    where: whereClause,
    select: { nome: true },
  });
}

export async function getDisciplinaId(id: number) {
  return await prisma.disciplina.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function getDisciplinaDetails(id: number) {
  return await prisma.disciplina.findUnique({ where: { id } });
}

export async function saveDisciplina(data: createDisciplinaBodyType) {
  return await prisma.disciplina.create({ data });
}

export async function changeDisciplina(
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
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
