import { prisma } from '../lib/prisma';
import { createCursoBodyType } from '../schemas/cursoSchema';

export async function getCursoNome(nome: string) {
  return await prisma.curso.findUnique({
    where: { nome },
    select: { id: true },
  });
}

export async function getCursoId(id: number) {
  return await prisma.curso.findUnique({
    where: { id },
    select: { id: true },
  });
}

// TODO: RETRIEVE MORE DATA FROM THIS TABLE
export async function getCurso(id: number) {
  return await prisma.curso.findUnique({ where: { id } });
}

export async function createCurso(data: createCursoBodyType) {
  const { disciplinas } = data;

  if (disciplinas) {
    return await prisma.curso.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        duracao: data.duracao,
        CursosDisciplinas: {
          createMany: {
            data: disciplinas.map((disciplinaId) => {
              return { disciplinaId };
            }),
          },
        },
      },
    });
  }

  return await prisma.curso.create({ data });
}

export async function updateCurso(id: number, data: createCursoBodyType) {
  return await prisma.curso.update({ where: { id }, data });
}

export async function getCursos() {
  return await prisma.curso.findMany({
    select: { id: true, nome: true },
    orderBy: { id: 'desc' },
  });
}
