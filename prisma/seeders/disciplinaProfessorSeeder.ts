import { prisma } from '../../src/lib/prisma';
import { generateRandomNumber } from './seed';

export async function seedProfessorDisciplina() {
  try {
    const [totalProfessor, totalDisciplina] = await Promise.all([
      prisma.professor.count(),
      prisma.disciplina.count(),
    ]);

    const minimumProfessorDisciplina = Math.round(
      totalProfessor / totalDisciplina
    );

    const professorDisciplinaStringArray: string[] = [];

    for (let i = 0; i < totalProfessor; i++) {
      const professorId = i + 1;

      for (let j = 0; j < minimumProfessorDisciplina; j++) {
        professorDisciplinaStringArray.push(
          `${professorId}-${generateRandomNumber(1, totalDisciplina)}`
        );
      }
    }

    const professorDisciplinaSet = new Set(professorDisciplinaStringArray);
    const professorDisciplina = Array.from(professorDisciplinaSet).map(
      (key) => {
        const [professorId, disciplinaId] = key.split('-');

        return {
          professorId: parseInt(professorId),
          disciplinaId: parseInt(disciplinaId),
        };
      }
    );

    await prisma.disciplinasProfessores.createMany({
      data: professorDisciplina,
    });
  } catch (err) {
    throw new Error(`\nError seeding ProfessorDisciplina \n${err}`);
  }
}

seedProfessorDisciplina()
  .then()
  .catch((err) => console.error(err));
