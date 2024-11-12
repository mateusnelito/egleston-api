import { prisma } from '../lib/prisma';
import { createProfessorBodyType } from '../schemas/professorSchemas';
import { formatDate } from '../utils/utilsFunctions';

export async function createProfessor(data: createProfessorBodyType) {
  const { disciplinas } = data;

  const createManyDisciplinaProfessorClause = disciplinas
    ? {
        createMany: {
          data: disciplinas.map((disciplinaId) => {
            return { disciplinaId };
          }),
        },
      }
    : {};

  const professor = await prisma.professor.create({
    data: {
      nomeCompleto: data.nomeCompleto,
      dataNascimento: data.dataNascimento,
      Contacto: {
        create: data.contacto,
      },
      DisciplinasProfessores: createManyDisciplinaProfessorClause,
    },
    include: {
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
    id: professor.id,
    nomeCompleto: professor.nomeCompleto,
    dataNascimento: formatDate(professor.dataNascimento),
    contacto: {
      telefone: professor.Contacto?.telefone,
      email: professor.Contacto?.email,
      outros: professor?.Contacto?.outros,
    },
  };
}

export async function getProfessor(id: number) {
  const professor = await prisma.professor.findUnique({
    where: { id },
    include: {
      Contacto: {
        select: {
          telefone: true,
          email: true,
          outros: true,
        },
      },
    },
  });

  if (professor) {
    return {
      id: professor.id,
      nomeCompleto: professor.nomeCompleto,
      dataNascimento: formatDate(professor.dataNascimento),
      contacto: {
        telefone: professor.Contacto?.telefone,
        email: professor.Contacto?.email,
        outros: professor?.Contacto?.outros,
      },
    };
  }
  return professor;
}

export async function getProfessorId(id: number) {
  return await prisma.professor.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function updateProfessor(
  id: number,
  data: createProfessorBodyType
) {
  const professor = await prisma.professor.update({
    where: { id },
    data: {
      nomeCompleto: data.nomeCompleto,
      dataNascimento: data.dataNascimento,
      Contacto: {
        update: data.contacto,
      },
    },
    include: {
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
    id: professor.id,
    nomeCompleto: professor.nomeCompleto,
    dataNascimento: formatDate(professor.dataNascimento),
    contacto: {
      telefone: professor.Contacto?.telefone,
      email: professor.Contacto?.email,
      outros: professor?.Contacto?.outros,
    },
  };
}

export async function getProfessores(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor ? { id: { lt: cursor } } : {};
  return await prisma.professor.findMany({
    where: whereClause,
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}
