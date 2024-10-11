import { Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../src/lib/prisma';

export async function seedResponsavel() {
  try {
    const dataPath = path.join(__dirname, 'data');

    const responsaveisData: Prisma.ResponsavelUncheckedCreateInput[] =
      JSON.parse(
        fs.readFileSync(path.join(dataPath, 'responsaveis.json'), 'utf-8')
      );

    const responsaveisEnderecosData: Prisma.ResponsavelEnderecoUncheckedCreateInput =
      JSON.parse(
        fs.readFileSync(
          path.join(dataPath, 'responsaveisEnderecos.json'),
          'utf8'
        )
      );

    const responsaveisContactosData: Prisma.ResponsavelContactoUncheckedCreateInput =
      JSON.parse(
        fs.readFileSync(
          path.join(dataPath, 'responsaveisContactos.json'),
          'utf8'
        )
      );

    await prisma.responsavel.createMany({ data: responsaveisData });

    await Promise.all([
      prisma.responsavelEndereco.createMany({
        data: responsaveisEnderecosData,
      }),
      prisma.responsavelContacto.createMany({
        data: responsaveisContactosData,
      }),
    ]);
  } catch (err) {
    throw new Error(`\nError seeding Responsavel \n${err}`);
  }
}
