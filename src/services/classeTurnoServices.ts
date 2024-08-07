import { prisma } from '../lib/prisma';

export async function getClasseTurnoById(classeId: number, turnoId: number) {
  return await prisma.classeTurno.findUnique({
    where: { classeId_turnoId: { classeId, turnoId } },
  });
}

export async function saveMultiplesClasseTurnoBasedOnClasseId(
  classeId: number,
  turnos: Array<number>
) {
  const classeTurnos = turnos.map(async (turnoId) => {
    return await prisma.classeTurno.create({ data: { classeId, turnoId } });
  });

  return classeTurnos;
}

export async function deleteMultiplesClasseTurnoBasedOnClasseId(
  classeId: number,
  turnos: Array<number>
) {
  const classeTurnos = turnos.map(async (turnoId) => {
    return await prisma.classeTurno.delete({
      where: { classeId_turnoId: { classeId, turnoId } },
    });
  });

  return classeTurnos;
}

export async function deleteClasseTurno(classeId: number, turnoId: number) {
  return await prisma.classeTurno.delete({
    where: { classeId_turnoId: { classeId, turnoId } },
  });
}

export async function createMultiplesClasseTurnoByTurno(
  turnoId: number,
  classes: Array<number>
) {
  return await prisma.classeTurno.createMany({
    data: classes.map((classeId) => {
      return {
        classeId,
        turnoId,
      };
    }),
  });
}
