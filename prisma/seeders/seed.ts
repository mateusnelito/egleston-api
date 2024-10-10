import { prisma } from '../../src/lib/prisma';
import { seedAnoLectivo } from './anoLectivoSeeder';
import { seedClasse } from './classeSeeder';
import { seedCursoDisciplina } from './cursoDisciplinaSeeder';
import { seedCurso } from './cursoSeeder';
import { seedDisciplina } from './disciplinaSeeder';
import { seedParentesco } from './parentescoSeeder';
import { seedSala } from './salaSeeder';
import { seedTurma } from './turmaSeeder';
import { seedTurno } from './turnoSeeder';

// Generates a random number between min and max
export function generateRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

async function seed() {
  await Promise.all([
    seedAnoLectivo(),
    seedTurno(),
    seedSala(),
    seedParentesco(),
    seedCurso(),
    seedDisciplina(),
  ]);

  await Promise.all([seedCursoDisciplina(), seedClasse()]);

  await seedTurma();
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
