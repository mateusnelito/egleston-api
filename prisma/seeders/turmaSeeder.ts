import { prisma } from '../../src/lib/prisma';
import { generateRandomNumber } from './seed';

enum TurmaNomeEnum {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
  E = 5,
}

export async function seedTurma() {
  try {
    const [totalClasses, totalSalas, totalTurnos] = await Promise.all([
      prisma.classe.count(),
      prisma.sala.count(),
      prisma.turno.count(),
    ]);

    const turmaSet = new Set<string>();

    // @@unique key: nome, classeId, salaId, turnoId
    for (let i = 0; i < totalClasses; i++) {
      const classeId = i + 1;
      const turmasCount = generateRandomNumber(1, 4);

      for (let j = 0; j < turmasCount; j++) {
        const salaId = generateRandomNumber(1, totalSalas);
        const turnoId = generateRandomNumber(1, totalTurnos);
        const turmaName = TurmaNomeEnum[generateRandomNumber(1, 5)];
        const turmaRelationKey = `${turmaName}-${classeId}-${salaId}-${turnoId}`;

        if (turmaSet.has(turmaRelationKey)) continue;

        turmaSet.add(turmaRelationKey);
      }
    }

    const turmas = Array.from(turmaSet).map((key) => {
      const [nome, classeIdString, salaIdString, turnoIdString] =
        key.split('-');

      return {
        nome,
        classeId: parseInt(classeIdString),
        salaId: parseInt(salaIdString),
        turnoId: parseInt(turnoIdString),
      };
    });

    await prisma.turma.createMany({ data: turmas });
  } catch (err) {
    throw new Error(`\nError seeding Turma \n${err}`);
  }
}
