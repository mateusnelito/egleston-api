import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string, alunoId?: number) {
  const whereClause = alunoId
    ? {
        alunoId: {
          not: alunoId,
        },
        telefone,
      }
    : {
        telefone,
      };

  return await prisma.alunoContacto.findFirst({
    where: whereClause,
    select: {
      telefone: true,
    },
  });
}

export async function getEmail(email: string, alunoId?: number) {
  const whereClause = alunoId
    ? {
        alunoId: {
          not: alunoId,
        },
        email,
      }
    : { email };

  return await prisma.alunoContacto.findFirst({
    where: whereClause,
    select: {
      telefone: true,
    },
  });
}
