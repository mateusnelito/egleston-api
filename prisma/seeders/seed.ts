import { prisma } from '../../src/lib/prisma';
import { seedAluno } from './alunoSeeder';
import { seedAnoLectivo } from './anoLectivoSeeder';
import { seedClasse } from './classeSeeder';
import { seedCursoDisciplina } from './cursoDisciplinaSeeder';
import { seedCurso } from './cursoSeeder';
import { seedProfessorDisciplina } from './disciplinaProfessorSeeder';
import { seedDisciplina } from './disciplinaSeeder';
import { seedMatricula } from './matriculaSeeder';
import { seedMetodoPagamento } from './metodoPagamento';
import { seedParentesco } from './parentescoSeeder';
import { seedProfessorDisciplinaClasseTurma } from './professorDIsciplinaClasseSeeder';
import { seedProfessor } from './professorSeeder';
import { seedResponsavel } from './responsavelSeeder';
import { seedSala } from './salaSeeder';
import { seedTurma } from './turmaSeeder';
import { seedTurno } from './turnoSeeder';

// Generates a random number between min and max
export function generateRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export function transformToDate(date: string) {
  return new Date(date);
}

async function seed() {
  await Promise.all([
    seedAnoLectivo(),
    seedTurno(),
    seedSala(),
    seedParentesco(),
    seedCurso(),
    seedDisciplina(),
    seedMetodoPagamento(),
  ]);

  await Promise.all([seedCursoDisciplina(), seedClasse()]);
  await Promise.all([seedTurma(), seedProfessor()]);

  await Promise.all([
    seedProfessorDisciplina(),
    seedProfessorDisciplinaClasseTurma(),
  ]);

  await seedAluno();
  await Promise.all([seedResponsavel(), seedMatricula()]);
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
