import { prisma } from '../lib/prisma';
import { createMatriculaToAlunoBodyType } from '../schemas/alunoSchemas';
import { getClasseAlunosQueryStringType } from '../schemas/classeSchemas';
import { getResourcesDefaultQueriesType } from '../schemas/globalSchema';
import { formatDate } from '../utils/utilsFunctions';

export async function getMatriculasByAlunoId(alunoId: number) {
  const matriculas = await prisma.matricula.findMany({
    where: {
      alunoId,
    },
    select: {
      id: true,
      createdAt: true,
      Classe: {
        select: {
          nome: true,
          Curso: {
            select: {
              nome: true,
            },
          },
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
        curso: matricula.Classe.Curso.nome,
        turma: matricula.Turma.nome,
        createdAt: matricula.createdAt,
      };
    }),
  };
}

export async function confirmAlunoMatricula(
  anoLectivoId: number,
  alunoId: number,
  data: createMatriculaToAlunoBodyType
) {
  return await prisma.$transaction(async (transaction) => {
    const matricula = await transaction.matricula.create({
      data: {
        alunoId,
        classeId: data.classeId,
        turmaId: data.turmaId,
        anoLectivoId,
      },
      include: {
        Aluno: {
          select: {
            id: true,
            nomeCompleto: true,
            nomeCompletoPai: true,
            nomeCompletoMae: true,
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
            Contacto: {
              select: {
                telefone: true,
                email: true,
              },
            },
          },
        },
        Classe: {
          select: {
            id: true,
            nome: true,
            valorMatricula: true,
            Curso: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        Turma: {
          select: {
            id: true,
            nome: true,
            Turno: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        AnoLectivo: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    const pagamento = await transaction.pagamento.create({
      data: {
        alunoId,
        tipoPagamento: 'Confirmacao',
        valor: matricula.Classe.valorMatricula,
        metodoPagamentoId: data.metodoPagamentoId,
        anoLectivoId,
      },
      include: {
        MetodoPagamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        AnoLectivo: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return {
      data: {
        id: matricula.id,
        aluno: {
          id: matricula.Aluno.id,
          nomeCompleto: matricula.Aluno.nomeCompleto,
          nomeCompletoPai: matricula.Aluno.nomeCompletoPai,
          nomeCompletoMae: matricula.Aluno.nomeCompletoMae,
          numeroBi: matricula.Aluno.numeroBi,
          dataNascimento: formatDate(matricula.Aluno.dataNascimento),
          genero: matricula.Aluno.genero,
          endereco: {
            bairro: matricula.Aluno.Endereco!.bairro,
            rua: matricula.Aluno.Endereco!.rua,
            numeroCasa: Number(matricula.Aluno.Endereco!.numeroCasa),
          },
          contacto: {
            telefone: matricula.Aluno.Contacto!.telefone,
            email: matricula.Aluno.Contacto?.email,
          },
        },
        classe: {
          id: matricula.Classe.id,
          nome: matricula.Classe.nome,
          valorMatricula: Number(matricula.Classe.valorMatricula),
        },
        curso: {
          id: matricula.Classe.Curso.id,
          nome: matricula.Classe.Curso.nome,
        },
        turma: { id: matricula.Turma.id, nome: matricula.Turma.nome },
        turno: {
          id: matricula.Turma.Turno.id,
          nome: matricula.Turma.Turno.nome,
        },
        anoLectivo: {
          id: matricula.AnoLectivo.id,
          nome: matricula.AnoLectivo.nome,
        },
        pagamento: {
          id: pagamento.id,
          tipoPagamento: pagamento.tipoPagamento,
          valor: Number(pagamento.valor),
          metodoPagamento: {
            id: pagamento.MetodoPagamento.id,
            nome: pagamento.MetodoPagamento.nome,
          },
          anoLectivo: {
            id: pagamento.AnoLectivo.id,
            nome: pagamento.AnoLectivo.nome,
          },
          descricao: pagamento.descricao,
          createdAt: pagamento.createdAt,
        },
        createdAt: matricula.createdAt,
        createdBy: { id: 1901, nome: 'Usuário 1019' }, // TODO: MAKE THIS DYNAMIC
      },
    };

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
      curso: matricula.Classe.Curso.nome,
      turma: matricula.Turma.nome,
      turno: matricula.Turma.Turno.nome,
      anoLectivo: matricula.AnoLectivo.nome,
      data: formatDate(matricula.createdAt),
      pagamento: {
        valor: Number(pagamento.valor),
        metodoPagamento: pagamento.MetodoPagamento.nome,
      },
      // TODO: MAKE THIS DYNAMIC
      funcionario: 'Usuário 1019',
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

export async function getAlunosMatriculaByClasse(
  classeId: number,
  data: getClasseAlunosQueryStringType
) {
  const { pageSize, cursor, turmaId } = data;

  const whereCursorClause = cursor
    ? {
        id: {
          lt: cursor,
        },
      }
    : {};

  const whereClause = turmaId
    ? { ...whereCursorClause, classeId, turmaId }
    : { ...whereCursorClause, classeId };

  const alunoMatriculas = await prisma.matricula.findMany({
    where: whereClause,
    select: {
      Aluno: {
        select: {
          id: true,
          nomeCompleto: true,
          numeroBi: true,
          dataNascimento: true,
          genero: true,
        },
      },
    },
    take: pageSize,
    orderBy: { Aluno: { id: 'desc' } },
  });

  return alunoMatriculas.map(
    ({ Aluno: { id, nomeCompleto, numeroBi, dataNascimento, genero } }) => ({
      id,
      nomeCompleto,
      numeroBi,
      dataNascimento: formatDate(dataNascimento),
      genero,
    })
  );
}

export async function getAlunosByTurma(
  turmaId: number,
  params: getResourcesDefaultQueriesType
) {
  const { pageSize, cursor } = params;

  const whereClause = cursor
    ? {
        turmaId,
        id: {
          lt: cursor,
        },
      }
    : { turmaId };

  const alunoMatriculas = await prisma.matricula.findMany({
    where: whereClause,
    select: {
      Aluno: {
        select: {
          id: true,
          nomeCompleto: true,
          numeroBi: true,
          dataNascimento: true,
          genero: true,
        },
      },
    },
    take: pageSize,
    orderBy: { Aluno: { id: 'desc' } },
  });

  return alunoMatriculas.map(
    ({ Aluno: { id, nomeCompleto, numeroBi, dataNascimento, genero } }) => ({
      id,
      nomeCompleto,
      numeroBi,
      dataNascimento: formatDate(dataNascimento),
      genero,
    })
  );
}

export async function getTotalMatriculas(classeId: number, turmaId: number) {
  return prisma.matricula.count({ where: { classeId, turmaId } });
}
