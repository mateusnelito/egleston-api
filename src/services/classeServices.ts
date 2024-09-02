import { prisma } from '../lib/prisma';

export async function getClasseByUniqueKey(
  nome: string,
  anoLectivoId: number,
  cursoId: number
) {
  return await prisma.classe.findUnique({
    where: { nome_anoLectivoId_cursoId: { nome, anoLectivoId, cursoId } },
    select: { id: true },
  });
}

interface classeDataInterface {
  nome: string;
  anoLectivoId: number;
  cursoId: number;
  valorMatricula: number;
}

export async function createClasse(data: classeDataInterface) {
  return await prisma.classe.create({ data });
}

export async function getClasseId(id: number) {
  return await prisma.classe.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function updateClasse(id: number, data: classeDataInterface) {
  return await prisma.classe.update({ where: { id }, data });
}

export async function getClasse(id: number) {
  const classe = await prisma.classe.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      AnoLectivo: {
        select: {
          nome: true,
        },
      },
      Curso: {
        select: { nome: true },
      },
    },
  });

  return {
    id: classe?.id,
    nome: classe?.nome,
    anoLectivo: classe?.AnoLectivo?.nome,
    curso: classe?.Curso?.nome,
  };
}

export async function getClassesByAnoLectivo(anoLectivoId: number) {
  return {
    data: await prisma.classe.findMany({
      where: { anoLectivoId },
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        Curso: { nome: 'asc' },
      },
    }),
  };
}

export async function getClassesByCurso(cursoId: number) {
  return {
    data: await prisma.classe.findMany({
      where: { cursoId },
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        AnoLectivo: { nome: 'desc' },
      },
    }),
  };
}
