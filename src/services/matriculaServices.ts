import { prisma } from '../lib/prisma';
import { createMatriculaToAlunoBodyType } from '../schemas/alunoSchemas';
import { formatDate } from '../utils/utilsFunctions';

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

export async function createMatriculaByAluno(
  anoLectivoId: number,
  alunoId: number,
  cursoId: number,
  data: createMatriculaToAlunoBodyType
) {
  return await prisma.$transaction(async (transaction) => {
    const matricula = await transaction.matricula.create({
      data: {
        alunoId,
        classeId: data.classeId,
        cursoId,
        turmaId: data.turmaId,
        turnoId: data.turnoId,
        anoLectivoId,
      },
      select: {
        id: true,
        createdAt: true,
        Aluno: {
          select: {
            nomeCompleto: true,
            numeroBi: true,
            genero: true,
            dataNascimento: true,
            Endereco: {
              select: {
                bairro: true,
                rua: true,
                numeroCasa: true,
              },
            },
          },
        },

        Classe: {
          select: {
            nome: true,
          },
        },
        Curso: {
          select: {
            nome: true,
          },
        },
        Turma: {
          select: {
            nome: true,
          },
        },
        Turno: {
          select: {
            nome: true,
          },
        },
        AnoLectivo: {
          select: {
            nome: true,
          },
        },
      },
    });

    const classe = await transaction.classe.findUnique({
      where: { id: data.classeId },
      select: { valorMatricula: true },
    });

    const pagamento = await transaction.pagamento.create({
      data: {
        alunoId,
        tipoPagamento: 'Matricula',
        valor: classe!.valorMatricula,
        metodoPagamentoId: data.metodoPagamentoId,
        anoLectivoId,
      },
      include: {
        MetodoPagamento: {
          select: {
            nome: true,
          },
        },
      },
    });

    return {
      id: matricula.id,
      aluno: {
        nome: matricula.Aluno.nomeCompleto,
        numeroBi: matricula.Aluno.numeroBi,
        dataNascimento: formatDate(matricula.Aluno.dataNascimento),
        genero: matricula.Aluno.genero,
        endereco: {
          bairro: matricula.Aluno.Endereco!.bairro,
          rua: matricula.Aluno.Endereco!.rua,
          numeroCasa: matricula.Aluno.Endereco!.numeroCasa,
        },
      },
      classe: matricula.Classe.nome,
      curso: matricula.Curso.nome,
      turma: matricula.Turma.nome,
      turno: matricula.Turno.nome,
      anoLectivo: matricula.AnoLectivo.nome,
      data: formatDate(matricula.createdAt),
      pagamento: {
        valor: Number(pagamento.valor),
        metodoPagamento: pagamento.MetodoPagamento.nome,
      },
      // TODO: MAKE THIS DYNAMIC
      funcionario: 'Usuário Teste Dinâmico',
    };
  });
}

export async function getMatriculaByUniqueKey(
  alunoId: number,
  classeId: number,
  anoLectivoId: number
) {
  return await prisma.matricula.findUnique({
    where: {
      alunoId_classeId_anoLectivoId: { alunoId, classeId, anoLectivoId },
    },
    select: { id: true },
  });
}

export async function getMatriculaIdById(id: number) {
  return await prisma.matricula.findUnique({
    where: { id },
    select: { id: true },
  });
}

// TODO: ADD CURSOR-BASED PAGINATION
export async function getAlunosMatriculaByClasse(
  classeId: number,
  turmaId?: number
) {
  const whereClause = turmaId ? { classeId, turmaId } : { classeId };

  const alunoMatriculas = await prisma.matricula.findMany({
    where: whereClause,
    select: {
      Aluno: {
        select: { id: true, nomeCompleto: true },
      },
    },
  });

  return {
    data: alunoMatriculas.map(({ Aluno: aluno }) => {
      return {
        id: aluno.id,
        nomeCompleto: aluno.nomeCompleto,
      };
    }),
  };
}

export async function getLastAlunoMatriculaCurso(alunoId: number) {
  return await prisma.matricula.findFirst({
    where: { alunoId },
    select: { cursoId: true },
    orderBy: { id: 'desc' },
  });
}
