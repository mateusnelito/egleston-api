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

export async function getAlunos(
  limit: number,
  cursor: number | null | undefined
) {
  // Applying cursor-based pagination
  if (cursor) {
    return await prisma.aluno.findMany({
      where: {
        id: {
          // Load only alunos where id is less than offset
          // Because the list start on last registry to first
          lt: cursor,
        },
      },
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });
  }

  return await prisma.aluno.findMany({
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
