import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { formatDate } from '../utils/utilsFunctions';

export async function getTotalTrimestresInAnoLectivo(anoLectivoId: number) {
  return await prisma.trimestre.count({ where: { anoLectivoId } });
}

export async function getLastTrimestreAddedInAnoLectivo(anoLectivoId: number) {
  return await prisma.trimestre.findFirst({
    where: { anoLectivoId },
    select: { id: true, termino: true },
    orderBy: { id: 'desc' },
  });
}

export async function getTrimestreByUniqueKey(
  anoLectivoId: number,
  numero: number
) {
  return await prisma.trimestre.findUnique({
    where: { anoLectivoId_numero: { anoLectivoId, numero } },
    select: { id: true },
  });
}

export async function createTrimestre(
  data: Prisma.TrimestreUncheckedCreateInput
) {
  const trimestre = await prisma.trimestre.create({
    data,
    select: {
      id: true,
      numero: true,
      inicio: true,
      termino: true,
      AnoLectivo: { select: { id: true, nome: true } },
    },
  });

  // TODO: REFACTOR THIS CODE TO A FUNCTION
  return {
    id: trimestre.id,
    anoLectivo: {
      id: trimestre.AnoLectivo.id,
      nome: trimestre.AnoLectivo.nome,
    },
    numero: trimestre.numero,
    inicio: formatDate(trimestre.inicio),
    termino: formatDate(trimestre.termino),
  };
}

export async function getTrimestreByAnoLectivo(anoLectivoId: number) {
  const trimestres = await prisma.trimestre.findMany({
    where: { anoLectivoId },
    select: { id: true, numero: true, inicio: true, termino: true },
    orderBy: { numero: 'asc' },
  });

  return {
    data: trimestres.map(({ id, numero, inicio, termino }) => {
      return {
        id,
        numero,
        inicio: formatDate(inicio),
        termino: formatDate(termino),
      };
    }),
  };
}

export async function getTrimestre(id: number) {
  const trimestre = await prisma.trimestre.findUnique({
    where: { id },
    select: {
      id: true,
      numero: true,
      inicio: true,
      termino: true,
      AnoLectivo: { select: { id: true, nome: true } },
    },
  });

  return trimestre
    ? {
        id: trimestre.id,
        anoLectivo: {
          id: trimestre.AnoLectivo.id,
          nome: trimestre.AnoLectivo.nome,
        },
        numero: trimestre.numero,
        inicio: formatDate(trimestre.inicio),
        termino: formatDate(trimestre.termino),
      }
    : trimestre;
}
