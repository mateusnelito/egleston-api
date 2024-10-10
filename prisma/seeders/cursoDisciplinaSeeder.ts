import { prisma } from '../../src/lib/prisma';
import { generateRandomNumber } from './seed';

export async function seedCursoDisciplina() {
  try {
    // Get total number of courses and disciplines
    const [totalCurso, totalDisciplina] = await Promise.all([
      prisma.curso.count(),
      prisma.disciplina.count(),
    ]);

    // Create a set to store unique course-discipline relations
    const cursoDisciplinaSet = new Set<string>();

    // Loop through each course
    for (let i = 0; i < totalCurso; i++) {
      const cursoId = i + 1; // Course ID starts from 1
      const disciplinasCount = generateRandomNumber(8, 12); // Randomly generate number of disciplines for the course

      // Loop through the number of disciplines
      for (let j = 0; j < disciplinasCount; j++) {
        const disciplinaId = generateRandomNumber(1, totalDisciplina); // Generate random discipline ID
        const cursoDisciplinaRelationKey = `${cursoId}-${disciplinaId}`; // Create a unique key for the relation

        // Skip if the relation already exists
        if (cursoDisciplinaSet.has(cursoDisciplinaRelationKey)) continue;

        cursoDisciplinaSet.add(cursoDisciplinaRelationKey); // Add unique relation to the set
      }
    }

    // Convert the set to an array of objects for database insertion
    const cursoDisciplinaArray = Array.from(cursoDisciplinaSet).map(
      (relationKey) => {
        const [cursoIdString, disciplinaIdString] = relationKey.split('-'); // Split the key into course and discipline IDs
        return {
          cursoId: parseInt(cursoIdString), // Parse course ID
          disciplinaId: parseInt(disciplinaIdString), // Parse discipline ID
        };
      }
    );

    // Insert all unique course-discipline relations into the database
    await prisma.cursosDisciplinas.createMany({
      data: cursoDisciplinaArray,
    });
  } catch (err) {
    throw new Error(`\nError seeding CursoDisciplina \n${err}`);
  }
}
