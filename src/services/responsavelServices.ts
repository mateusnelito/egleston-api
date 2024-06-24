import { prisma } from '../lib/prisma';
import { responsavelBodyType } from '../schemas/responsavelSchema';

export async function saveResponsavel(
  aluno: number,
  responsavelData: responsavelBodyType
) {
  return await prisma.responsavel.create({
    data: {
      alunoId: aluno,
      nomeCompleto: responsavelData.nomeCompleto,
      parentescoId: responsavelData.parentescoId,
      Endereco: {
        create: {
          bairro: responsavelData.bairro,
          rua: responsavelData.rua,
          numeroCasa: responsavelData.numeroCasa,
        },
      },
      Contacto: {
        create: {
          telefone: responsavelData.telefone,
          email: responsavelData.email,
          outros: responsavelData.outros,
        },
      },
    },
  });
}

export async function getResponsavelDetails(id: number) {
  return await prisma.responsavel.findUnique({
    where: {
      id,
    },
    include: {
      Parentesco: {
        select: {
          nome: true,
        },
      },
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
          outros: true,
        },
      },
    },
    // select: {
    //   id: true,
    //   nomeCompleto: true,
    // },
  });
}

export async function getResponsavelById(id: number) {
  return await prisma.responsavel.findUnique({
    where: {
      id,
    },
  });
}

export async function changeResponsavel(
  id: number,
  responsavelData: responsavelBodyType
) {
  return await prisma.responsavel.update({
    where: {
      id,
    },
    data: {
      nomeCompleto: responsavelData.nomeCompleto,
      parentescoId: responsavelData.parentescoId,
      Endereco: {
        update: {
          bairro: responsavelData.bairro,
          rua: responsavelData.rua,
          numeroCasa: responsavelData.numeroCasa,
        },
      },
      Contacto: {
        update: {
          telefone: responsavelData.telefone,
          email: responsavelData.email,
          outros: responsavelData.outros,
        },
      },
    },
  });
}

export async function deleteResponsavel(id: number) {
  return await prisma.responsavel.delete({ where: { id } });
}
