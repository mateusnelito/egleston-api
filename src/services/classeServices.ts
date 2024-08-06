import { prisma } from '../lib/prisma';
import { createClasseBodyType } from '../schemas/classeSchemas';

export async function getClasseByCompostUniqueKey(
  nome: string,
  anoLectivoId: number,
  cursoId: number
) {
  return await prisma.classe.findUnique({
    where: { nome_anoLectivoId_cursoId: { nome, anoLectivoId, cursoId } },
    select: { id: true },
  });
}

export async function createClasse(data: createClasseBodyType) {
  const { turnos } = data;
  if (turnos) {
    return await prisma.classe.create({
      data: {
        nome: data.nome,
        anoLectivoId: data.anoLectivoId,
        cursoId: data.cursoId,
        ClasseTurno: {
          createMany: {
            data: turnos.map((turnoId) => {
              return { turnoId };
            }),
          },
        },
      },
    });
  }

  return await prisma.classe.create({ data });
}

export async function getClasseId(id: number) {
  return await prisma.classe.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function updateClasse(id: number, data: createClasseBodyType) {
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
  return await prisma.classe.findMany({
    where: { anoLectivoId },
    select: {
      id: true,
      nome: true,
      Curso: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: {
      Curso: { nome: 'asc' },
    },
  });
}

export async function getClassesByCurso(cursoId: number) {
  const classes = await prisma.classe.findMany({
    where: { cursoId },
    select: {
      id: true,
      nome: true,
      AnoLectivo: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: {
      AnoLectivo: { nome: 'desc' },
    },
  });

  return {
    data: classes.map((classe) => {
      return {
        id: classe.id,
        nome: classe.nome,
        anoLectivo: classe.AnoLectivo.nome,
      };
    }),
  };
}
