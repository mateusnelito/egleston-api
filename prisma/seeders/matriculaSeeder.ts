import fs from 'fs';
import path from 'path';
import { prisma } from '../../src/lib/prisma';
import { Prisma } from '@prisma/client';

export async function seedMatricula() {
  try {
    const matriculasDataPath = path.join(__dirname, 'data', 'matriculas.json');

    const matriculasData: Prisma.MatriculaUncheckedCreateInput[] = JSON.parse(
      fs.readFileSync(matriculasDataPath, 'utf-8')
    );

    await prisma.matricula.createMany({
      data: matriculasData,
      skipDuplicates: true,
    });
  } catch (err) {
    throw new Error(`\nError seeding Matricula \n${err}`);
  }
}
