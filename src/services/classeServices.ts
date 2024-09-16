import { Prisma } from '@prisma/client';
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

export async function createClasse(data: Prisma.ClasseUncheckedCreateInput) {
  return await prisma.classe.create({ data });
}

export async function getClasseId(id: number) {
  return await prisma.classe.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function updateClasse(
  id: number,
  data: Prisma.ClasseUncheckedUpdateInput
) {
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

  if (classe) {
    return {
      id: classe?.id,
      nome: classe?.nome,
      anoLectivo: classe?.AnoLectivo?.nome,
      curso: classe?.Curso?.nome,
    };
  }

  return classe;
}

export async function getClassesByAnoLectivo(anoLectivoId: number) {
  const classes = await prisma.classe.findMany({
    where: { anoLectivoId },
    select: {
      id: true,
      nome: true,
      Curso: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
    orderBy: {
      Curso: { nome: 'asc' },
    },
  });

  // TODO: SEARCH FOR BETTER WAY TO TYPE acc
  const groupedClassesByCurso = classes.reduce((acc: any, classe) => {
    const { Curso } = classe;
    const { id, nome } = Curso;

    if (!acc[id]) {
      acc[id] = {
        nome,
        classes: [],
      };
    }
    acc[id].classes.push({
      id: classe.id,
      nome: classe.nome,
    });

    return acc;
  }, {});

  return {
    data: {
      cursos: groupedClassesByCurso,
    },
  };
}

export async function getClassesByCurso(cursoId: number, anoLectivoId: number) {
  return {
    data: await prisma.classe.findMany({
      where: { cursoId, anoLectivoId },
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

export async function getClasseAndAnoLectivoActivoStatus(id: number) {
  return await prisma.classe.findUnique({
    where: { id },
    select: { id: true, AnoLectivo: { select: { id: true, activo: true } } },
  });
}
