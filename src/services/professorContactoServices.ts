import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string, id?: number) {
  const whereClause = id
    ? { professorId: { not: id }, telefone }
    : { telefone };

  return await prisma.professorContacto.findFirst({
    where: whereClause,
    select: {
      telefone: true,
    },
  });
}

export async function getEmail(email: string, id?: number) {
  const whereClause = id ? { professorId: { not: id }, email } : { email };

  return await prisma.professorContacto.findFirst({
    where: whereClause,
    select: {
      email: true,
    },
  });
}
