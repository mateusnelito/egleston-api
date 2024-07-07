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

    const cursoDisciplinas = await prisma.cursosDisciplinas.findMany({
      where: { cursoId: curso.id },
      select: {
        disciplinaId: true,
      },
    });

    return {
      ...curso,
      disciplinas: cursoDisciplinas.map((disciplina) => {
        return disciplina.disciplinaId;
      }),
    };
  }

  return curso;
}

export async function changeCurso(id: number, data: createCursoBodyType) {
  return await prisma.curso.update({ where: { id }, data });
}

// Return all cursos without pagination
export async function getCursos() {
  return await prisma.curso.findMany({
    select: { id: true, nome: true },
    orderBy: { id: 'desc' },
  });
}
