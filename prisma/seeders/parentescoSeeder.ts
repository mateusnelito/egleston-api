import { prisma } from '../../src/lib/prisma';

export async function seedParentesco() {
  try {
    await prisma.parentesco.createMany({
      data: [
        { nome: 'Pai' },
        { nome: 'Mãe' },
        { nome: 'Tio' },
        { nome: 'Tia' },
      ],
    });
  } catch (err) {
    throw new Error(`\nError seeding Parentesco \n${err}`);
  }
}
