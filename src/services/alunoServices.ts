import { prisma } from '../lib/prisma';
import {
  CreateAlunoBodyType,
  updateAlunoBodyType,
} from '../schemas/alunoSchema';

// Fn utils
function createEnderecoData(bairro: string, rua: string, numeroCasa: string) {
  return {
    bairro,
    rua,
    numeroCasa,
  };
}

function createContactoData(telefone: string, email?: string, outros?: string) {
  return {
    telefone,
    email,
    outros,
  };
}

// Save aluno, responsaveis and related records (endereco, contacto)
export async function saveAluno(alunoData: CreateAlunoBodyType) {
  return prisma.$transaction(async (transaction) => {
    // Save the aluno on database
    const aluno = await transaction.aluno.create({
      data: {
        nomeCompleto: alunoData.nomeCompleto,
        nomeCompletoPai: alunoData.nomeCompletoPai,
        nomeCompletoMae: alunoData.nomeCompletoMae,
        numeroBi: alunoData.numeroBi,
        dataNascimento: alunoData.dataNascimento,
        genero: alunoData.genero,
        Endereco: {
          create: createEnderecoData(
            alunoData.bairro,
            alunoData.rua,
            alunoData.numeroCasa
          ),
        },
        Contacto: {
          create: createContactoData(alunoData.telefone, alunoData.email),
        },
      },
    });

    // Save the responsaveis, related with aluno
    for (const responsavel of alunoData.responsaveis) {
      await transaction.responsavel.create({
        data: {
          alunoId: aluno.id,
          nomeCompleto: responsavel.nomeCompleto,
          parentescoId: responsavel.parentescoId,
          Endereco: {
            create: createEnderecoData(
              responsavel.bairro,
              responsavel.rua,
              responsavel.numeroCasa
            ),
          },
          Contacto: {
            create: createContactoData(
              responsavel.telefone,
              responsavel.email,
              responsavel.outros
            ),
          },
        },
      });
    }
    return aluno;
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
