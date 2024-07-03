import { prisma } from '../lib/prisma';
import { createCursoBodyType } from '../schemas/cursoSchema';

export async function getCursoNome(nome: string, id?: number) {
  const whereClause = id ? { id: { not: id }, nome } : { nome };
  return await prisma.curso.findFirst({
    where: whereClause,
    select: { nome: true },
  });
}

export async function getCursoId(id: number) {
  return await prisma.curso.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function getCursoDetails(id: number) {
  return await prisma.curso.findUnique({ where: { id } });
}

interface disciplinas {
  disciplinaId: number;
}

export async function saveCurso(data: createCursoBodyType) {
  const curso = await prisma.curso.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      duracao: data.duracao,
    },
  });

  // Handle with n-n association between cursos and disciplinas
  if (data.disciplinas) {
    for (const disciplina of data.disciplinas) {
      await prisma.cursosDisciplinas.create({
        data: { cursoId: curso.id, disciplinaId: disciplina },
      });
    }
  }
  return curso;
}

export async function changeCurso(id: number, data: createCursoBodyType) {
  return await prisma.curso.update({ where: { id }, data });
}

export async function getCursos(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor ? { id: { lt: cursor } } : {};
  return await prisma.curso.findMany({
    where: whereClause,
    take: limit,
    orderBy: {
      id: 'desc',
    },
  });
}

export async function checkCursoDisciplinaAssociation(
  cursoId: number,
  disciplinaId: number
) {
  return await prisma.cursosDisciplinas.findUnique({
    where: {
      cursoId_disciplinaId: { cursoId, disciplinaId },
    },
  });
}

export async function associateDisciplinas(
  id: number,
  disciplinas: Array<number>
) {
  for (const disciplina of disciplinas) {
    await prisma.cursosDisciplinas.create({
      data: { cursoId: id, disciplinaId: disciplina },
    });
  }
}
