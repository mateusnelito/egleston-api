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
        select: { nome: true },
      },
      Sala: {
        select: { nome: true },
      },
    },
  });

  if (turma) {
    return {
      id: turma?.id,
      nome: turma?.nome,
      classe: turma?.Classe.nome,
      sala: turma?.Sala.nome,
    };
  }
}

export async function getTurmasByClasse(classeId: number) {
  return {
    data: await prisma.turma.findMany({
      where: { classeId },
      select: { id: true, nome: true },
    }),
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
