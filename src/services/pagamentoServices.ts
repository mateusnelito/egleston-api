import { prisma } from '../lib/prisma';
import { createPagamentoBodyType } from '../schemas/pagamentoSchemas';

export async function createPagamento(data: createPagamentoBodyType) {
  return await prisma.pagamento.create({ data });
}
