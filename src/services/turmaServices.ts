import { prisma } from '../lib/prisma';

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
