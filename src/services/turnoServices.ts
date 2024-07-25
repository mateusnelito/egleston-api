import { prisma } from '../lib/prisma';
import { turnoBodyType } from '../schemas/turnoSchemas';

export async function getTurnoByNome(nome: string) {
  return await prisma.turno.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function saveTurno(data: turnoBodyType) {
  return await prisma.turno.create({ data });
}

export async function getTurnos() {
  return await prisma.turno.findMany({
    select: { id: true, nome: true },
    orderBy: { id: 'desc' },
  });
}

export async function getTurnoByInicioAndTermino(
  inicio: string,
  termino: string
) {
  return await prisma.turno.findUnique({
    where: { inicio_termino: { inicio, termino } },
    select: { id: true },
  });
}
