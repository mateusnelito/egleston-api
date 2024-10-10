import { prisma } from '../../src/lib/prisma';
import { anoLectivoSeeder } from './anoLectivoSeeder';
import { turnoSeeder } from './turnoSeeder';

async function seed() {
  anoLectivoSeeder()
    .then(() => console.log('\nSeed Ano Lectivo done!\n'))
    .catch((err) => console.log(`Error seeding Ano Lectivo: \n${err}`));

  turnoSeeder()
    .then(() => console.log('\nSeed Turno done!\n'))
    .catch((err) => console.log(`\nError seeding Turno: \n${err}`));
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
