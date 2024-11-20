import { prisma } from '../../src/lib/prisma';
import { generateRandomNumber } from './seed';

export async function seedClasseDisciplina() {
  try {
    // Get total number of classes and disciplines
    const [totalClasse, totalDisciplina] = await Promise.all([
      prisma.classe.count(),
      prisma.disciplina.count(),
    ]);

    // Create a set to store unique classe-discipline relations
    const classeDisciplinaSet = new Set<string>();

    // Loop through each classe
    for (let i = 0; i < totalClasse; i++) {
      const classeId = i + 1; // classe ID starts from 1
      const disciplinasCount = generateRandomNumber(8, 12); // Randomly generate number of disciplines for the classe

      // Loop through the number of disciplines
      for (let j = 0; j < disciplinasCount; j++) {
        const disciplinaId = generateRandomNumber(1, totalDisciplina); // Generate random discipline ID
        const classeDisciplinaRelationKey = `${classeId}-${disciplinaId}`; // Create a unique key for the relation

        // Skip if the relation already exists
        if (classeDisciplinaSet.has(classeDisciplinaRelationKey)) continue;

        classeDisciplinaSet.add(classeDisciplinaRelationKey); // Add unique relation to the set
      }
    }

    // Convert the set to an array of objects for database insertion
    const classeDisciplinaArray = Array.from(classeDisciplinaSet).map(
      (relationKey) => {
        const [classeIdString, disciplinaIdString] = relationKey.split('-'); // Split the key into classe and discipline IDs
        return {
          classeId: parseInt(classeIdString), // Parse classe ID
          disciplinaId: parseInt(disciplinaIdString), // Parse discipline ID
        };
      }
    );

    // Insert all unique classe-discipline relations into the database
    await prisma.classeDisciplinas.createMany({
      data: classeDisciplinaArray,
    });
  } catch (err) {
    throw new Error(`\nError seeding ClasseDisciplina \n${err}`);
  }
}
