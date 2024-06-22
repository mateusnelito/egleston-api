import { prisma } from '../lib/prisma';

export async function getTelefone(telefone: string) {
  return await prisma.responsavelContacto.findUnique({ where: { telefone } });
}

export async function getEmail(email: string) {
  return await prisma.responsavelContacto.findUnique({
    where: { email },
  });
}
