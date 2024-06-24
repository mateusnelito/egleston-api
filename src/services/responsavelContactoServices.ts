import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string, responsavel?: number) {
  if (responsavel) {
    return await prisma.responsavelContacto.findFirst({
      where: {
        responsavelId: {
          not: responsavel,
        },
        telefone,
      },
      select: {
        telefone: true,
      },
    });
  }

  return await prisma.responsavelContacto.findUnique({
    where: { telefone },
    select: { telefone: true },
  });
}

export async function getEmail(email: string, responsavel?: number) {
  if (responsavel) {
    return await prisma.responsavelContacto.findFirst({
      where: {
        responsavelId: {
          not: responsavel,
        },
        email,
      },
      select: {
        email: true,
      },
    });
  }

  return await prisma.responsavelContacto.findUnique({
    where: { email },
    select: {
      email: true,
    },
  });
}
