import { prisma } from '../lib/prisma';

export async function getMatriculasByAlunoId(alunoId: number) {
  const matriculas = await prisma.matricula.findMany({
    where: {
      alunoId,
    },
    select: {
      id: true,
      createdAt: true,
      Curso: {
        select: {
          nome: true,
        },
      },
      Classe: {
        select: {
          nome: true,
        },
      },
      Turma: {
        select: {
          nome: true,
        },
      },
    },
  });

  return {
    data: matriculas.map((matricula) => {
      return {
        id: matricula.id,
        classe: matricula.Classe.nome,
        curso: matricula.Curso.nome,
        turma: matricula.Turma.nome,
        createdAt: matricula.createdAt,
      };
    }),
  };
}
