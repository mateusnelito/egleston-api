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

export async function getAnoLectivoNome(nome: string) {
  return await prisma.anoLectivo.findUnique({
    where: { nome },
    select: { nome: true },
  });
}

export async function getAnoLectivoInicioTermino(
  inicio: Date,
  termino: Date,
  id?: number
) {
  const whereClause = id
    ? {
        id: { not: id },
        inicio_termino: { inicio, termino },
      }
    : { inicio_termino: { inicio, termino } };

  return await prisma.anoLectivo.findFirst({
    where: whereClause,
    select: { inicio: true, termino: true },
  });
}
