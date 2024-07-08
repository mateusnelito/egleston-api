import { prisma } from '../lib/prisma';
import { professorBodyType } from '../schemas/professorSchemas';
import { formatDate } from '../utils/utils';

export async function saveProfessor(data: professorBodyType) {
  const professor = await prisma.professor.create({
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

  // Handle with n-n association between professores and disciplinas
  if (data.disciplinas) {
    for (const disciplinaId of data.disciplinas) {
      await prisma.disciplinasProfessores.create({
        data: { professorId: professor.id, disciplinaId },
      });
    }

    const professorDisciplinas = await prisma.disciplinasProfessores.findMany({
      where: { professorId: professor.id },
      select: {
        disciplinaId: true,
      },
    });

    return {
      id: professor.id,
      nomeCompleto: professor.nomeCompleto,
      dataNascimento: formatDate(professor.dataNascimento),
      disciplinas: professorDisciplinas.map((disciplina) => {
        return disciplina.disciplinaId;
      }),
    };
  }

  return professor;
}

export async function getProfessorDetails(id: number) {
  return await prisma.professor.findUnique({
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
}

export async function getProfessorId(id: number) {
  return await prisma.professor.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function changeProfessor(id: number, data: professorBodyType) {
  return await prisma.professor.update({
    where: { id },
    data: {
      nomeCompleto: data.nomeCompleto,
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

export async function deleteResponsavel(id: number) {
  return await prisma.responsavel.delete({ where: { id } });
}
