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

export async function getAnoLectivoActivo() {
  const anoLectivo = await prisma.anoLectivo.findFirst({
    where: { activo: true },
    select: {
      id: true,
      inicio: true,
      termino: true,
      activo: true,
      matriculaAberta: true,
    },
  });

  if (!anoLectivo)
    throw new Error('Nenhum ano lectivo activo encontrado', {
      cause:
        'Nenhum ano lectivo com status activo encontrado no banco de dados, buscando classe por ano lectivo',
    });

  return anoLectivo;
}

export async function changeAnoLectivoStatus(
  id: number,
  activo: boolean | undefined,
  matriculaAberta: boolean | undefined
) {
  return await prisma.anoLectivo.update({
    where: { id },
    data: { activo, matriculaAberta },
  });
}

export async function changeAnoLectivoMatriculaAbertaState(
  id: number,
  matriculaAberta: boolean
) {
  return await prisma.anoLectivo.update({
    where: { id },
    data: { matriculaAberta },
  });
}
