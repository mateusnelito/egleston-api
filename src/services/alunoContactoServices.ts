import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string) {
  return await prisma.alunoContacto.findUnique({
    where: {
      telefone,
    },
    select: {
      telefone: true,
    },
  });
}

export async function getEmail(email: string) {
  return await prisma.alunoContacto.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });
}
