import { prisma } from '../lib/prisma';

interface anoLectivoInterface {
  nome: string;
  inicio: Date;
  termino: Date;
}

export async function createAnoLectivo(data: anoLectivoInterface) {
  return await prisma.anoLectivo.create({ data });
}

export async function getAnoLectivoByNome(nome: string) {
  return await prisma.anoLectivo.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function getAnoLectivoId(id: number) {
  return await prisma.anoLectivo.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function updateAnoLectivo(id: number, data: anoLectivoInterface) {
  return await prisma.anoLectivo.update({
    where: { id },
    data,
  });
}

export async function getAnoLectivos() {
  return {
    data: await prisma.anoLectivo.findMany({
      select: { id: true, nome: true, activo: true },
      orderBy: { id: 'desc' },
    }),
  };
}

export async function getAnoLectivo(id: number) {
  return await prisma.anoLectivo.findUnique({ where: { id } });
}

export async function getAnoLectivoActivo(activo: boolean) {
  return await prisma.anoLectivo.findFirst({
    where: { activo },
    select: { id: true, inicio: true, termino: true },
  });
}

export async function changeAnoLectivoActiveState(id: number, activo: boolean) {
  return await prisma.anoLectivo.update({ where: { id }, data: { activo } });
}
