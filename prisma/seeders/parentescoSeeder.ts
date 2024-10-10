import { prisma } from '../../src/lib/prisma';

export async function seedParentesco() {
  await prisma.parentesco.createMany({
    data: [{ nome: 'Pai' }, { nome: 'Mãe' }, { nome: 'Tio' }, { nome: 'Tia' }],
  });
}
