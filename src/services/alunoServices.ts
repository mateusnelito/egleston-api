import { string } from 'zod';
import { prisma } from '../lib/prisma';
import {
  CreateAlunoBodyType,
  updateAlunoBodyType,
} from '../schemas/alunoSchema';

// Save aluno, endereco and contactos
export async function saveAluno(aluno: CreateAlunoBodyType) {
  return await prisma.aluno.create({
    data: {
      nomeCompleto: aluno.nomeCompleto,
      nomeCompletoPai: aluno.nomeCompletoPai,
      nomeCompletoMae: aluno.nomeCompletoMae,
      numeroBi: aluno.numeroBi,
      dataNascimento: aluno.dataNascimento,
      genero: aluno.genero,
      Endereco: {
        create: {
          bairro: aluno.bairro,
          rua: aluno.rua,
          numeroCasa: aluno.numeroCasa,
        },
      },
      Contacto: {
        create: {
          telefone: aluno.telefone,
          email: aluno.email,
        },
      },
    },
  });
}

export async function getAlunoByNumeroBi(numeroBi: string) {
  return await prisma.aluno.findUnique({
    where: { numeroBi },
    select: {
      id: true,
    },
  });
}

export async function getAlunoById(alunoId: number) {
  return await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: {
      Endereco: {
        select: {
          bairro: true,
          rua: true,
          numeroCasa: true,
        },
      },
      Contacto: {
        select: {
          telefone: true,
          email: true,
        },
      },
    },
  });
}

export async function changeAluno(alunoId: number, aluno: updateAlunoBodyType) {
  return await prisma.aluno.update({
    where: {
      id: alunoId,
    },
    data: {
      nomeCompleto: aluno.nomeCompleto,
      nomeCompletoPai: aluno.nomeCompletoPai,
      nomeCompletoMae: aluno.nomeCompletoMae,
      dataNascimento: aluno.dataNascimento,
      genero: aluno.genero,
      Endereco: {
        update: {
          bairro: aluno.bairro,
          rua: aluno.rua,
          numeroCasa: aluno.numeroCasa,
        },
      },
      Contacto: {
        update: {
          telefone: aluno.telefone,
          email: aluno.email,
        },
      },
    },
  });
}

export async function getAlunos(
  limit: number,
  cursor: number | null | undefined
) {
  const SELECT_FIELDS = {
    id: true,
    nomeCompleto: true,
    numeroBi: true,
    dataNascimento: true,
    genero: true,
  };

  // Applying cursor-based pagination
  if (cursor) {
    return await prisma.aluno.findMany({
      where: {
        id: {
          // Load only alunos where id is less than offset
          // Because the list start on last registry to first
          lt: cursor,
        },
      },
      select: SELECT_FIELDS,
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });
  }

  return await prisma.aluno.findMany({
    take: limit,
    orderBy: {
      id: 'desc',
    },
    select: SELECT_FIELDS,
  });
}
