import { prisma } from '../lib/prisma';

interface anoLectivo {
  nome: string;
  inicio: Date;
  termino: Date;
}

export async function saveAnoLectivo(data: anoLectivo) {
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

export async function getAnoLectivoInicioTermino(
  inicio: Date,
  termino: Date,
  id?: number
) {
  const select = { inicio: true, termino: true };

  if (id) {
    return await prisma.anoLectivo.findFirst({
      where: { id: { not: id }, inicio, termino },
      select,
    });
  }

  return await prisma.anoLectivo.findUnique({
    where: { inicio_termino: { inicio, termino } },
    select,
  });
}

export async function getAnoLectivoId(id: number) {
  return await prisma.anoLectivo.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function changeAnoLectivo(id: number, data: anoLectivo) {
  return await prisma.anoLectivo.update({
    where: { id },
    data,
  });
}

export async function recoveryAnoLectivos() {
  return await prisma.anoLectivo.findMany({
    select: { id: true, nome: true },
  });
}
