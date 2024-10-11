import { Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../src/lib/prisma';

export async function seedAluno() {
  const dataPath = path.join(__dirname, 'data');

  const alunosData: Prisma.AlunoUncheckedCreateInput[] = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'alunos.json'), 'utf-8')
  );

  const alunosEnderecosData: Prisma.AlunoEnderecoUncheckedCreateInput =
    JSON.parse(
      fs.readFileSync(path.join(dataPath, 'alunosEnderecos.json'), 'utf8')
    );

  const alunosContactosData: Prisma.AlunoContactoUncheckedCreateInput =
    JSON.parse(
      fs.readFileSync(path.join(dataPath, 'alunosContactos.json'), 'utf8')
    );

  await prisma.aluno.createMany({ data: alunosData });

  await Promise.all([
    prisma.alunoEndereco.createMany({ data: alunosEnderecosData }),
    prisma.alunoContacto.createMany({ data: alunosContactosData }),
  ]);
}
