import { prisma } from '../lib/prisma';
import { turnoBodyType } from '../schemas/turnoSchemas';

export async function getTurnoByNome(nome: string, id?: number) {
  const whereClause = id
    ? {
        id: { not: id },
        nome,
      }
    : { nome };

  return await prisma.turno.findFirst({
    where: whereClause,
    select: { nome: true },
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

export async function getTurnoId(id: number) {
  return await prisma.turno.findUnique({ where: { id }, select: { id: true } });
}

export async function changeTurno(id: number, data: turnoBodyType) {
  return await prisma.turno.update({
    where: { id },
    data,
    select: { nome: true, inicio: true, termino: true },
  });
}

export async function getTurno(id: number) {
  return await prisma.turno.findUnique({ where: { id } });
}
