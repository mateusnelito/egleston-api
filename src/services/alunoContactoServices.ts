import { prisma } from '../lib/prisma';

export async function getAlunoTelefone(telefone: string) {
  return await prisma.alunoContacto.findUnique({
    where: { telefone },
    select: {
      alunoId: true,
    },
  });
}

export async function getAlunoEmail(email: string) {
  return await prisma.alunoContacto.findUnique({
    where: { email },
    select: {
      alunoId: true,
    },
  });
}
