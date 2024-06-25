import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string, responsavelId?: number) {
  const whereClause = responsavelId
    ? { responsavelId: { not: responsavelId }, telefone }
    : { telefone };

  return await prisma.responsavelContacto.findFirst({
    where: whereClause,
    select: {
      telefone: true,
    },
  });
}

export async function getEmail(email: string, responsavelId?: number) {
  const whereClause = responsavelId
    ? { responsavelId: { not: responsavelId }, email }
    : { email };

  return await prisma.responsavelContacto.findFirst({
    where: whereClause,
    select: {
      email: true,
    },
  });
}
