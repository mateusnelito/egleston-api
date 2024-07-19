import { prisma } from '../lib/prisma';
import { postAnoLectivoBodyType } from '../schemas/anoLectivoSchema';

export async function saveAnoLectivo(data: postAnoLectivoBodyType) {
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

export async function getAnoLectivoInicioTermino(inicio: Date, termino: Date) {
  return await prisma.anoLectivo.findUnique({
    where: { inicio_termino: { inicio, termino } },
    select: { inicio: true, termino: true },
  });
}
