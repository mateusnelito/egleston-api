import { prisma } from '../../src/lib/prisma';
import { seedAnoLectivo } from './anoLectivoSeeder';
import { seedCurso } from './cursoSeeder';
import { seedParentesco } from './parentescoSeeder';
import { seedSala } from './salaSeeder';
import { seedTurno } from './turnoSeeder';

async function seed() {
  seedAnoLectivo()
    .then(() => console.log('\nSeed Ano Lectivo done!\n'))
    .catch((err) => console.log(`Error seeding Ano Lectivo: \n${err}`));

  seedTurno()
    .then(() => console.log('\nSeed Turno done!\n'))
    .catch((err) => console.log(`\nError seeding Turno: \n${err}`));

  seedSala()
    .then(() => console.log('\nSeed Sala done!\n'))
    .catch((err) => console.log(`\nError seeding Sala: \n${err}`));

  seedParentesco()
    .then(() => console.log('\nSeed Parentesco done!\n'))
    .catch((err) => console.log(`\nError seeding Parentesco: \n${err}`));

  seedCurso()
    .then(() => console.log('\nSeed Curso done!\n'))
    .catch((err) => console.log(`\nError seeding Curso: \n${err}`));
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
