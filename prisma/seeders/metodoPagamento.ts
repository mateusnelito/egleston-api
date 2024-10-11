import { prisma } from '../../src/lib/prisma';

export async function seedMetodoPagamento() {
  try {
    await prisma.metodoPagamento.createMany({
      data: [
        { nome: 'Cash' },
        { nome: 'TPA' },
        { nome: 'Depósito Bancário' },
        { nome: 'ATM' },
        { nome: 'Transferência Bancária' },
        { nome: 'Unitel Money' },
        { nome: 'Africell Money' },
      ],
    });
  } catch (err) {
    throw new Error(`\nError seeding MetodoPagamento \n${err}`);
  }
}
