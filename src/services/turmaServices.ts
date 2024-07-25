import { prisma } from '../lib/prisma';
import { turmaBodyType } from '../schemas/turmaSchemas';

export async function getTurmaByUniqueCompostKey(
  nome: string,
  classeId: number,
  salaId: number
) {
  return await prisma.turma.findUnique({
    where: { nome_classeId_salaId: { nome, classeId, salaId } },
    select: { id: true },
  });
}

export async function saveTurma(data: turmaBodyType) {
  return await prisma.turma.create({ data });
}

export async function getTurmaId(id: number) {
  return await prisma.turma.findUnique({ where: { id }, select: { id: true } });
}

export async function changeTurma(id: number, data: turmaBodyType) {
  return await prisma.turma.update({ where: { id }, data });
}
