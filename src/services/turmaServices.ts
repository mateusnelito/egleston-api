import { prisma } from '../lib/prisma';
import { turmaBodyType } from '../schemas/turmaSchemas';

export async function getTurmaByUniqueKey(
  nome: string,
  classeId: number,
  salaId: number,
  turnoId: number
) {
  return await prisma.turma.findUnique({
    where: {
      nome_classeId_salaId_turnoId: { nome, classeId, salaId, turnoId },
    },
    select: { id: true },
  });
}

export async function createTurma(data: turmaBodyType) {
  return await prisma.turma.create({ data });
}

export async function getTurmaId(id: number) {
  return await prisma.turma.findUnique({ where: { id }, select: { id: true } });
}

export async function updateTurma(id: number, data: turmaBodyType) {
  return await prisma.turma.update({ where: { id }, data });
}

export async function getTurma(id: number) {
  const turma = await prisma.turma.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      Classe: {
        select: { id: true, nome: true },
      },
      Sala: {
        select: { id: true, nome: true },
      },
      Turno: {
        select: { id: true, nome: true },
      },
    },
  });

  return turma
    ? {
        id: turma.id,
        nome: turma.nome,
        classe: turma.Classe,
        sala: turma.Sala,
        turno: turma.Turno,
      }
    : turma;
}

export async function getTurmasByClasse(classeId: number) {
  const turmas = await prisma.turma.findMany({
    where: { classeId },
    select: {
      id: true,
      nome: true,
      Turno: { select: { id: true, nome: true } },
    },
  });
  return {
    data: turmas.map(({ id, nome, Turno }) => ({
      id,
      nome,
      turno: Turno,
    })),
  };
}

export async function getTurmasBySala(salaId: number) {
  return {
    data: await prisma.turma.findMany({
      where: { salaId },
      select: { id: true, nome: true },
    }),
  };
}

export async function getTurmaByIdAndClasse(id: number, classeId: number) {
  return await prisma.turma.findFirst({
    where: { id, classeId },
    select: { id: true },
  });
}

export async function isTurmaInClasse(id: number, classeId: number) {
  return prisma.turma.findUnique({
    where: { id, classeId },
    select: { id: true },
  });
}

export async function getTurmaSala(id: number) {
  const turmaSala = await prisma.turma.findUnique({
    where: { id },
    select: { Sala: { select: { id: true, nome: true, capacidade: true } } },
  });

  return { sala: turmaSala?.Sala };
}
