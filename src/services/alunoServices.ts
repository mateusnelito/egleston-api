import { prisma } from '../lib/prisma';
import {
  CreateAlunoBodyType,
  updateAlunoBodyType,
} from '../schemas/alunoSchema';

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

export async function getAlunoById(alunoId: number) {
  return await prisma.aluno.findUnique({
    where: { id: alunoId },
  });
}

export async function changeAluno(alunoId: number, aluno: updateAlunoBodyType) {
  return await prisma.aluno.update({
    where: { id: alunoId },
    data: aluno,
  });
}

export async function getAlunos(offset: number, limit: number) {
  return await prisma.aluno.findMany({
    where: {
      id: {
        // Load only alunos where id is greater than offset
        gt: offset,
      },
    },
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
