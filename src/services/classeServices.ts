import { prisma } from '../lib/prisma';
import { postClasseBodyType } from '../schemas/classeSchemas';

export async function getClasseByCompostUniqueKey(
  nome: string,
  anoLectivoId: number,
  cursoId: number
) {
  return await prisma.classe.findUnique({
    where: {
      nome_anoLectivoId_cursoId: { nome, anoLectivoId, cursoId },
    },
    select: { id: true },
  });
}

export async function saveClasse(data: postClasseBodyType) {
  return await prisma.classe.create({ data });
}

export async function getClasseId(id: number) {
  return await prisma.classe.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function changeClasse(id: number, data: postClasseBodyType) {
  return await prisma.classe.update({ where: { id }, data });
}
