import { prisma } from '../lib/prisma';

interface anoLectivoInterface {
  nome: string;
  inicio: Date;
  termino: Date;
}

export async function saveAnoLectivo(data: anoLectivoInterface) {
  return await prisma.anoLectivo.create({
    data,
  });
}

export async function getAnoLectivoNome(nome: string, id?: number) {
  const whereClause = id
    ? {
        id: { not: id },
        nome,
      }
    : { nome };

  return await prisma.anoLectivo.findFirst({
    where: whereClause,
    select: { nome: true },
  });
}

export async function getAnoLectivoId(id: number) {
  return await prisma.anoLectivo.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function changeAnoLectivo(id: number, data: anoLectivoInterface) {
  return await prisma.anoLectivo.update({
    where: { id },
    data,
  });
}

export async function recoveryAnoLectivos() {
  return await prisma.anoLectivo.findMany({
    select: { id: true, nome: true },
    orderBy: { id: 'desc' },
  });
}

export async function recoveryAnoLectivo(id: number) {
  return await prisma.anoLectivo.findUnique({ where: { id } });
}
