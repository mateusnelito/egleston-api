import { prisma } from '../lib/prisma';
import { professorBodyType } from '../schemas/professorSchemas';
import { responsavelBodyType } from '../schemas/responsavelSchema';

export async function saveProfessor(data: professorBodyType) {
  return await prisma.professor.create({
    data: {
      nomeCompleto: data.nomeCompleto,
      dataNascimento: data.dataNascimento,
      Contacto: {
        create: {
          telefone: data.telefone,
          email: data.email,
          outros: data.outros,
        },
      },
    },
  });
}

export async function getResponsavelDetails(id: number) {
  return await prisma.responsavel.findUnique({
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
}

export async function getResponsavelId(id: number) {
  return await prisma.responsavel.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function changeResponsavel(id: number, data: responsavelBodyType) {
  return await prisma.responsavel.update({
    where: { id },
    data: {
      nomeCompleto: data.nomeCompleto,
      parentescoId: data.parentescoId,
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
          outros: data.outros,
        },
      },
    },
  });
}

export async function deleteResponsavel(id: number) {
  return await prisma.responsavel.delete({ where: { id } });
}
