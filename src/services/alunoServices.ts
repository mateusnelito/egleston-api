import { prisma } from '../lib/prisma';
import {
  CreateAlunoBodyType,
  updateAlunoBodyType,
} from '../schemas/alunoSchema';

// Fn utils
function createEnderecoData(bairro: string, rua: string, numeroCasa: string) {
  return { bairro, rua, numeroCasa };
}

function createContactoData(telefone: string, email?: string, outros?: string) {
  return { telefone, email, outros };
}

// Save aluno, responsaveis and related records (endereco, contacto)
export async function saveAluno(data: CreateAlunoBodyType) {
  return prisma.$transaction(async (transaction) => {
    // Save the aluno on database
    const aluno = await transaction.aluno.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        nomeCompletoPai: data.nomeCompletoPai,
        nomeCompletoMae: data.nomeCompletoMae,
        numeroBi: data.numeroBi,
        // FIXME: Remove this functionality to appropriated place
        dataNascimento: new Date(data.dataNascimento),
        genero: data.genero,
        Endereco: {
          create: createEnderecoData(data.bairro, data.rua, data.numeroCasa),
        },
        Contacto: {
          create: createContactoData(data.telefone, data.email),
        },
      },
    });

    // Save the responsaveis, related with aluno
    for (const responsavel of data.responsaveis) {
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

export async function getAlunoNumeroBi(numeroBi: string) {
  return await prisma.aluno.findUnique({
    where: { numeroBi },
    select: { id: true },
  });
}

export async function getAlunoDetails(id: number) {
  return await prisma.aluno.findUnique({
    where: { id },
    include: {
      Endereco: {
        select: {
          bairro: true,
          rua: true,
          numeroCasa: true,
        },
      },
      Contacto: {
        select: { telefone: true, email: true },
      },
    },
  });
}

export async function getAlunoId(id: number) {
  return await prisma.aluno.findUnique({ where: { id }, select: { id: true } });
}

export async function changeAluno(id: number, data: updateAlunoBodyType) {
  return await prisma.aluno.update({
    where: { id },
    data: {
      nomeCompleto: data.nomeCompleto,
      nomeCompletoPai: data.nomeCompletoPai,
      nomeCompletoMae: data.nomeCompletoMae,
      // FIXME: REMOVE THIS CODE TO APPROPRIATED PLACE
      dataNascimento: new Date(data.dataNascimento),
      genero: data.genero,
      Endereco: {
        update: {
          bairro: data.bairro,
          rua: data.rua,
          numeroCasa: data.numeroCasa,
        },
      },
      Contacto: {
        update: {
          telefone: data.telefone,
          email: data.email,
        },
      },
    },
  });
}

export async function getAlunos(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor
    ? {
        id: {
          // Load only alunos where id is less than offset
          // Because the list start on last registry to first
          lt: cursor,
        },
      }
    : {};

  return await prisma.aluno.findMany({
    where: whereClause,
    select: {
      id: true,
      nomeCompleto: true,
      numeroBi: true,
      dataNascimento: true,
      genero: true,
    },
    take: limit,
    orderBy: { id: 'desc' },
  });
}

export async function getAlunoResponsaveis(alunoId: number) {
  return await prisma.responsavel.findMany({
    where: { alunoId },
    select: { id: true, nomeCompleto: true },
  });
}
