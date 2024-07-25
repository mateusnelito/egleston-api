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
