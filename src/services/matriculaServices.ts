import { prisma } from '../lib/prisma';
import { createAlunoMatriculaBodyType } from '../schemas/alunoSchemas';
import { formatDate } from '../utils/utils';

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

export async function createMatricula(
  alunoId: number,
  data: createAlunoMatriculaBodyType
) {
  return await prisma.$transaction(async (transaction) => {
    const matricula = await transaction.matricula.create({
      data: {
        alunoId,
        classeId: data.classeId,
        cursoId: data.cursoId,
        turmaId: data.turmaId,
        anoLectivoId: data.anoLectivoId,
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
            Turno: {
              select: {
                nome: true,
              },
            },
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
        anoLectivoId: data.anoLectivoId,
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
      turno: matricula.Turma.Turno.nome,
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

export async function getMatriculaIdByCompostKey(
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
