import { prisma } from '../lib/prisma';
import { createResponsavelBodyType } from '../schemas/responsavelSchema';

export async function createResponsavel(
  alunoId: number,
  data: createResponsavelBodyType
) {
  return await prisma.responsavel.create({
    data: {
      alunoId,
      nomeCompleto: data.nomeCompleto,
      parentescoId: data.parentescoId,
      Endereco: {
        create: data.endereco,
      },
      Contacto: {
        create: data.contacto,
      },
    },
  });
}

export async function getResponsavel(id: number) {
  const responsavel = await prisma.responsavel.findUnique({
    where: { id },
    include: {
      Parentesco: {
        select: { nome: true },
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
  });

  if (responsavel) {
    // TODO: REMOVE THIS DUPLICATED CODE
    return {
      id: responsavel.id,
      nomeCompleto: responsavel.nomeCompleto,
      parentesco: responsavel.Parentesco.nome,
      endereco: {
        bairro: responsavel?.Endereco?.bairro,
        rua: responsavel?.Endereco?.rua,
        numeroCasa: responsavel?.Endereco?.numeroCasa,
      },
      contacto: {
        telefone: responsavel?.Contacto?.telefone,
        email: responsavel?.Contacto?.email,
        outros: responsavel?.Contacto?.outros,
      },
    };
  }
}

export async function getResponsavelId(id: number) {
  return await prisma.responsavel.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function updateResponsavel(
  id: number,
  data: createResponsavelBodyType
) {
  const responsavel = await prisma.responsavel.update({
    where: { id },
    data: {
      nomeCompleto: data.nomeCompleto,
      parentescoId: data.parentescoId,
      Endereco: {
        update: data.endereco,
      },
      Contacto: {
        update: data.contacto,
      },
    },
    include: {
      Parentesco: {
        select: { nome: true },
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
  });

  return {
    id: responsavel.id,
    nomeCompleto: responsavel.nomeCompleto,
    parentesco: responsavel.Parentesco.nome,
    endereco: {
      bairro: responsavel?.Endereco?.bairro,
      rua: responsavel?.Endereco?.rua,
      numeroCasa: responsavel?.Endereco?.numeroCasa,
    },
    contacto: {
      telefone: responsavel?.Contacto?.telefone,
      email: responsavel?.Contacto?.email,
      outros: responsavel?.Contacto?.outros,
    },
  };
}

export async function deleteResponsavel(id: number) {
  const responsavel = await prisma.responsavel.delete({
    where: { id },
    include: {
      Parentesco: {
        select: { nome: true },
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
  });

  return {
    id: responsavel.id,
    nomeCompleto: responsavel.nomeCompleto,
    parentesco: responsavel.Parentesco.nome,
    endereco: {
      bairro: responsavel?.Endereco?.bairro,
      rua: responsavel?.Endereco?.rua,
      numeroCasa: responsavel?.Endereco?.numeroCasa,
    },
    contacto: {
      telefone: responsavel?.Contacto?.telefone,
      email: responsavel?.Contacto?.email,
      outros: responsavel?.Contacto?.outros,
    },
  };
}

export async function getTotalAlunoResponsaveis(alunoId: number) {
  return await prisma.responsavel.count({
    where: { alunoId },
  });
}
