import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string) {
  return await prisma.professorContacto.findUnique({
    where: { telefone },
    select: {
      professorId: true,
    },
  });
}

export async function getEmail(email: string) {
  return await prisma.professorContacto.findUnique({
    where: { email },
    select: {
      professorId: true,
    },
  });
}
