import { prisma } from '../../src/lib/prisma';
import { anoLectivoSeeder } from './anoLectivoSeeder';

export function transformToDate(date: string) {
  return new Date(date);
}

async function seed() {
  await anoLectivoSeeder();
}

seed()
  .then(() => console.log('\n🌱 Database seeded successfully\n'))
  .catch((err) => {
    console.error(`🛑 Error seeding database: \n ${err}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Ensure Prisma disconnects after the seed
  });