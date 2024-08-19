import { prisma } from '../lib/prisma';
import { createMetodoPagamentoBodyType } from '../schemas/metodoPagamentoSchemas';

export async function getMetodoPagamentoByNome(nome: string) {
  return await prisma.metodoPagamento.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function createMetodoPagamento(
  data: createMetodoPagamentoBodyType
) {
  return await prisma.metodoPagamento.create({ data });
}

export async function getMetodoPagamentoById(id: number) {
  return await prisma.metodoPagamento.findUnique({ where: { id } });
}

export async function updateMetodoPagamento(
  id: number,
  data: createMetodoPagamentoBodyType
) {
  return await prisma.metodoPagamento.update({ where: { id }, data });
}

export async function getMetodosPagamento() {
  return { data: await prisma.metodoPagamento.findMany() };
}
