import { prisma } from '../lib/prisma';

export async function getResponsavelTelefone(telefone: string) {
  return await prisma.responsavelContacto.findUnique({
    where: { telefone },
    select: {
      responsavelId: true,
    },
  });
}

export async function getResponsavelEmail(email: string) {
  return await prisma.responsavelContacto.findFirst({
    where: { email },
    select: {
      responsavelId: true,
    },
  });
}
