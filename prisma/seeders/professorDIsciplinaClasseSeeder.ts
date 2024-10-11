import { prisma } from '../../src/lib/prisma';
import { generateRandomNumber } from './seed';

export async function seedProfessorDisciplinaClasseTurma() {
  try {
    // Get total count of professors, disciplines, classes, and turmas
    const [totalProfessor, totalDisciplina, totalClasse, totalTurma] =
      await Promise.all([
        prisma.professor.count(),
        prisma.disciplina.count(),
        prisma.classe.count(),
        prisma.turma.count(),
      ]);

    // Calculate the minimum number of classes each professor will teach
    const minimumClassesPerProfessor = Math.round(totalClasse / totalProfessor);

    // Set to store unique combinations of professor, discipline, class, and turma
    const professorDisciplinaClasseTurmaSet = new Set<string>();

    for (let i = 0; i < totalProfessor; i++) {
      const professorId = i + 1;
      const numClasses = generateRandomNumber(1, minimumClassesPerProfessor); // Number of classes a professor will teach

      for (let j = 0; j < numClasses; j++) {
        const classeId = generateRandomNumber(1, totalClasse); // Select class
        const turmaId = generateRandomNumber(1, totalTurma); // Select turma

        for (let k = 0; k < 2; k++) {
          // Maximum 2 disciplines per class
          const disciplinaId = generateRandomNumber(1, totalDisciplina);
          const relationKey = `${professorId}-${disciplinaId}-${classeId}-${turmaId}`;

          // Skip if the relation already exists
          if (professorDisciplinaClasseTurmaSet.has(relationKey)) continue;

          // Add the unique relation to the set
          professorDisciplinaClasseTurmaSet.add(relationKey);
        }
      }
    }

    // Convert set into array of objects for database insertion
    const professorDisciplinaClasseTurmaArray = Array.from(
      professorDisciplinaClasseTurmaSet
    ).map((relationKey) => {
      const [professorId, disciplinaId, classeId, turmaId] =
        relationKey.split('-');

      return {
        professorId: parseInt(professorId),
        disciplinaId: parseInt(disciplinaId),
        classeId: parseInt(classeId),
        turmaId: parseInt(turmaId),
      };
    });

    // Insert data into the database
    await prisma.professorDisciplinaClasse.createMany({
      data: professorDisciplinaClasseTurmaArray,
    });
  } catch (err) {
    throw new Error(`\nError seeding ProfessorDisciplinaClasseTurma \n${err}`);
  }
}

seedProfessorDisciplinaClasseTurma()
  .then()
  .catch((err) => console.error(err));
