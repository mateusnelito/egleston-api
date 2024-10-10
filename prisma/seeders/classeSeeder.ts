import { Prisma } from '@prisma/client';
import { prisma } from '../../src/lib/prisma';
import { generateRandomNumber } from './seed';

export async function seedClasse() {
  try {
    const [anoLectivo, totalCursos] = await Promise.all([
      prisma.anoLectivo.findFirst({
        where: { activo: true },
        select: { id: true },
      }),
      prisma.curso.count(),
    ]);

    if (!anoLectivo) throw new Error('Active AnoLectivo not found');

    const classeArray: Prisma.ClasseUncheckedCreateInput[] = [];

    for (let i = 0; i < totalCursos; i++) {
      const cursoId = i + 1;
      const classesCount = generateRandomNumber(3, 4);

      for (let j = 0; j < classesCount; j++) {
        classeArray.push({
          nome: `1${j}ª`,
          cursoId,
          anoLectivoId: anoLectivo.id,
          valorMatricula: generateRandomNumber(3000, 10000),
        });
      }
    }

    await prisma.classe.createMany({ data: classeArray });
  } catch (err) {
    throw new Error(`\nError seeding Classe \n${err}`);
  }
}
