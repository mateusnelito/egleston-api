import { prisma } from '../lib/prisma';
import { createCursoBodyType } from '../schemas/cursoSchema';

export async function getCursoNome(nome: string, id?: number) {
  const whereClause = id ? { id: { not: id }, nome } : { nome };
  return await prisma.curso.findFirst({
    where: whereClause,
    select: { nome: true },
  });
}

export async function getCursoId(id: number) {
  return await prisma.curso.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function getCursoDetails(id: number) {
  return await prisma.curso.findUnique({ where: { id } });
}

export async function saveCurso(data: createCursoBodyType) {
  return await prisma.curso.create({ data });
}

export async function changeCurso(id: number, data: createCursoBodyType) {
  return await prisma.curso.update({ where: { id }, data });
}

export async function getCursos(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor ? { id: { lt: cursor } } : {};
  return await prisma.curso.findMany({
    where: whereClause,
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
