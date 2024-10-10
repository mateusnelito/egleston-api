import { prisma } from '../../src/lib/prisma';

export function transformToDate(date: string) {
  return new Date(date);
}

async function seed() {}

seed()
  .then(() => console.log('\n🌱 Database seeded successfully\n'))
  .catch((err) => {
    console.error(`🛑 Error seeding database: \n ${err}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Ensure Prisma disconnects after the seed
  });
