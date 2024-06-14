import { prisma } from '../lib/prisma';
import { CreateAlunoBodyType } from '../schemas/alunoSchema';

export async function saveAluno(aluno: CreateAlunoBodyType) {
  return await prisma.aluno.create({
    data: aluno,
  });
}

export async function getAlunoByNumeroBi(numeroBi: string) {
  return await prisma.aluno.findUnique({
    where: { numeroBi },
    select: {
      id: true,
    },
  });
}
