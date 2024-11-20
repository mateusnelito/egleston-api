import { prisma } from '../lib/prisma';
import { createDisciplinaBodyType } from '../schemas/disciplinaSchema';
import { getClasseId } from './classeServices';
import { isTurmaInClasse } from './turmaServices';

export async function getDisciplinaNome(nome: string) {
  return await prisma.disciplina.findFirst({
    where: { nome },
    select: { id: true },
  });
}

export async function getDisciplinaId(id: number) {
  return await prisma.disciplina.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function getDisciplina(id: number) {
  return await prisma.disciplina.findUnique({ where: { id } });
}

export async function createDisciplina(data: createDisciplinaBodyType) {
  return await prisma.disciplina.create({ data });
}

export async function updateDisciplina(
  id: number,
  data: createDisciplinaBodyType
) {
  return await prisma.disciplina.update({ where: { id }, data });
}

export async function getDisciplinas(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor ? { id: { lt: cursor } } : {};
  return await prisma.disciplina.findMany({
    where: whereClause,
    select: {
      id: true,
      nome: true,
    },
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}

export async function getNonAssociatedProfessorDisciplinas(
  classeId: number,
  turmaId: number
) {
  // Check if turma belongs to the classe
  const turmaClasse = await isTurmaInClasse(turmaId, classeId);

  // If turma is not associated to the classe, return an empty array
  if (!turmaClasse) return { data: [] };

  // Fetch all disciplinas that are not associated with the specified turma and classe
  const disciplinas = await prisma.disciplina.findMany({
    where: {
      ProfessorDisciplinaClasse: {
        none: { classeId, turmaId }, // Exclude disciplinas linked to this turma and classe
      },
      ClasseDisciplinas: {
        some: { classeId }, // Include only disciplinas associated with classe
      },
    },
    select: { id: true, nome: true }, // Return only the id and name of the disciplinas
  });

  // Return the list of disciplinas without assigned professors for the turma and classe
  return { data: disciplinas };
}
