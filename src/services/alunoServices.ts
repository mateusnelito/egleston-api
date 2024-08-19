import { prisma } from '../lib/prisma';
import { updateAlunoBodyType } from '../schemas/alunoSchemas';
import { formatDate } from '../utils/utils';

export async function getAlunoNumeroBi(numeroBi: string) {
  return await prisma.aluno.findUnique({
    where: { numeroBi },
    select: { id: true },
  });
}

export async function getAluno(id: number) {
  const aluno = await prisma.aluno.findUnique({
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
      _count: {
        select: {
          Responsaveis: {},
        },
      },
    },
  });

  if (aluno) {
    // TODO: MAKE A FN TO FORMAT ALUNO DATA
    return {
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      nomeCompletoPai: aluno.nomeCompletoPai,
      nomeCompletoMae: aluno.nomeCompletoMae,
      numeroBi: aluno.numeroBi,
      dataNascimento: formatDate(aluno.dataNascimento),
      genero: aluno.genero,
      endereco: {
        bairro: aluno.Endereco?.bairro,
        rua: aluno.Endereco?.rua,
        numeroCasa: aluno.Endereco?.numeroCasa,
      },
      contacto: {
        telefone: aluno.Contacto?.telefone,
        email: aluno.Contacto?.email,
      },
      responsaveis: aluno._count.Responsaveis,
    };
  } else {
    return aluno;
  }
}

export async function getAlunoId(id: number) {
  return await prisma.aluno.findUnique({ where: { id }, select: { id: true } });
}

export async function updateAluno(id: number, data: updateAlunoBodyType) {
  const aluno = await prisma.aluno.update({
    where: { id },
    data: {
      nomeCompleto: data.nomeCompleto,
      nomeCompletoPai: data.nomeCompletoPai,
      nomeCompletoMae: data.nomeCompletoMae,
      dataNascimento: data.dataNascimento,
      genero: data.genero,
      Endereco: {
        update: data.endereco,
      },
      Contacto: {
        update: data.contacto,
      },
    },
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

  return {
    id: aluno.id,
    nomeCompleto: aluno.nomeCompleto,
    nomeCompletoPai: aluno.nomeCompletoPai,
    nomeCompletoMae: aluno.nomeCompletoMae,
    numeroBi: aluno.numeroBi,
    dataNascimento: formatDate(aluno.dataNascimento),
    genero: aluno.genero,
    endereco: {
      bairro: aluno.Endereco?.bairro,
      rua: aluno.Endereco?.rua,
      numeroCasa: aluno.Endereco?.numeroCasa,
    },
    contacto: {
      telefone: aluno.Contacto?.telefone,
      email: aluno.Contacto?.email,
    },
  };
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

  const alunos = await prisma.aluno.findMany({
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

  return alunos.map((aluno) => {
    return {
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      numeroBi: aluno.numeroBi,
      dataNascimento: formatDate(aluno.dataNascimento),
      genero: aluno.genero,
    };
  });
}

export async function getAlunoResponsaveis(alunoId: number) {
  return await prisma.responsavel.findMany({
    where: { alunoId },
    select: { id: true, nomeCompleto: true },
  });
}
