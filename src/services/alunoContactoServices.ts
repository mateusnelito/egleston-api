import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string, aluno?: number) {
  if (aluno) {
    return await prisma.alunoContacto.findFirst({
      where: {
        alunoId: {
          not: aluno,
        },
        telefone,
      },
      select: {
        telefone: true,
      },
    });
  }

  return await prisma.alunoContacto.findUnique({
    where: {
      telefone,
    },
    select: {
      telefone: true,
    },
  });
}

export async function getEmail(email: string, aluno?: number) {
  if (aluno) {
    return await prisma.alunoContacto.findFirst({
      where: {
        alunoId: {
          not: aluno,
        },
        email,
      },
      select: {
        telefone: true,
      },
    });
  }

  return await prisma.alunoContacto.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });
}
