import { prisma } from '../lib/prisma';
import { updateAlunoBodyType } from '../schemas/alunoSchemas';
import { createMatriculaBodyType } from '../schemas/matriculaSchemas';
import { getAlunosWithoutNotaQueryStringDataType } from '../schemas/notaSchema';
import { formatDate } from '../utils/utilsFunctions';

export async function getAlunoNumeroBi(numeroBi: string) {
  return await prisma.aluno.findUnique({
    where: { numeroBi },
    select: { id: true },
  });
}

export async function getAluno(id: number) {
  const aluno = await prisma.aluno.findUnique({
    where: { id },
    include: {
      Endereco: {
        select: {
          bairro: true,
          rua: true,
          numeroCasa: true,
        },
      },
      Contacto: {
        select: { telefone: true, email: true },
      },
      _count: {
        select: {
          Responsaveis: {},
        },
      },
    },
  });

  if (aluno) {
    // TODO: MAKE A FN TO FORMAT ALUNO DATA
    return {
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      nomeCompletoPai: aluno.nomeCompletoPai,
      nomeCompletoMae: aluno.nomeCompletoMae,
      numeroBi: aluno.numeroBi,
      dataNascimento: formatDate(aluno.dataNascimento),
      genero: aluno.genero,
      endereco: {
        bairro: aluno.Endereco?.bairro,
        rua: aluno.Endereco?.rua,
        numeroCasa: aluno.Endereco?.numeroCasa,
      },
      contacto: {
        telefone: aluno.Contacto?.telefone,
        email: aluno.Contacto?.email,
      },
      totalResponsaveis: aluno._count.Responsaveis,
    };
  } else {
    return aluno;
  }
}

export async function getAlunoId(id: number) {
  return await prisma.aluno.findUnique({ where: { id }, select: { id: true } });
}

export async function updateAluno(id: number, data: updateAlunoBodyType) {
  const aluno = await prisma.aluno.update({
    where: { id },
    data: {
      nomeCompleto: data.nomeCompleto,
      nomeCompletoPai: data.nomeCompletoPai,
      nomeCompletoMae: data.nomeCompletoMae,
      dataNascimento: data.dataNascimento,
      genero: data.genero,
      Endereco: {
        update: data.endereco,
      },
      Contacto: {
        update: data.contacto,
      },
    },
    include: {
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
  });

  return {
    id: aluno.id,
    nomeCompleto: aluno.nomeCompleto,
    nomeCompletoPai: aluno.nomeCompletoPai,
    nomeCompletoMae: aluno.nomeCompletoMae,
    numeroBi: aluno.numeroBi,
    dataNascimento: formatDate(aluno.dataNascimento),
    genero: aluno.genero,
    endereco: {
      bairro: aluno.Endereco?.bairro,
      rua: aluno.Endereco?.rua,
      numeroCasa: aluno.Endereco?.numeroCasa,
    },
    contacto: {
      telefone: aluno.Contacto?.telefone,
      email: aluno.Contacto?.email,
    },
  };
}

export async function getAlunos(
  limit: number,
  cursor: number | null | undefined
) {
  const whereClause = cursor
    ? {
        id: {
          // Load only alunos where id is less than offset
          // Because the list start on last registry to first
          lt: cursor,
        },
      }
    : {};

  const alunos = await prisma.aluno.findMany({
    where: whereClause,
    select: {
      id: true,
      nomeCompleto: true,
      numeroBi: true,
      dataNascimento: true,
      genero: true,
    },
    take: limit,
    orderBy: { id: 'desc' },
  });

  return alunos.map((aluno) => {
    return {
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      numeroBi: aluno.numeroBi,
      dataNascimento: formatDate(aluno.dataNascimento),
      genero: aluno.genero,
    };
  });
}

export async function getAlunoResponsaveis(alunoId: number) {
  return {
    data: await prisma.responsavel.findMany({
      where: { alunoId },
      select: { id: true, nomeCompleto: true },
    }),
  };
}

export async function createAlunoMatricula(
  anoLectivoId: number,
  matriculaData: createMatriculaBodyType
) {
  const { aluno: alunoData, classeId, metodoPagamentoId } = matriculaData;

  return await prisma.$transaction(async (transaction) => {
    const aluno = await transaction.aluno.create({
      data: {
        nomeCompleto: alunoData.nomeCompleto,
        nomeCompletoPai: alunoData.nomeCompletoPai,
        nomeCompletoMae: alunoData.nomeCompletoMae,
        numeroBi: alunoData.numeroBi,
        dataNascimento: alunoData.dataNascimento,
        genero: alunoData.genero,
        Endereco: {
          create: alunoData.endereco,
        },
        Contacto: {
          create: alunoData.contacto,
        },
        Matricula: {
          create: {
            classeId: matriculaData.classeId,
            turmaId: matriculaData.turmaId,
            anoLectivoId,
          },
        },
      },
      include: {
        Endereco: {
          select: {
            bairro: true,
            rua: true,
            numeroCasa: true,
          },
        },
        Matricula: {
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
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    for (const responsavel of alunoData.responsaveis) {
      // Persist aluno responsaveis data
      await transaction.responsavel.create({
        data: {
          alunoId: aluno.id,
          nomeCompleto: responsavel.nomeCompleto,
          parentescoId: responsavel.parentescoId,
          Endereco: {
            create: responsavel.endereco,
          },
          Contacto: {
            create: responsavel.contacto,
          },
        },
      });
    }

    const classe = await transaction.classe.findUnique({
      where: { id: classeId },
      select: { valorMatricula: true },
    });

    const pagamento = await transaction.pagamento.create({
      data: {
        alunoId: aluno.id,
        tipoPagamento: 'Matricula',
        valor: classe!.valorMatricula,
        metodoPagamentoId,
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

    const matricula = aluno.Matricula[0];

    return {
      id: matricula.id,
      aluno: {
        nome: aluno.nomeCompleto,
        numeroBi: aluno.numeroBi,
        dataNascimento: formatDate(aluno.dataNascimento),
        genero: aluno.genero,
        endereco: {
          bairro: aluno.Endereco!.bairro,
          rua: aluno.Endereco!.rua,
          numeroCasa: aluno.Endereco!.numeroCasa,
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

export async function getAlunosAbsentNotas(
  data: getAlunosWithoutNotaQueryStringDataType,
  limit: number,
  cursor: number | null | undefined
) {
  const { classeId, disciplinaId, trimestreId, turmaId } = data;

  const whereCursorClause = cursor
    ? {
        id: {
          lt: cursor,
        },
      }
    : {};

  const alunos = await prisma.aluno.findMany({
    where: {
      AlunoNota: {
        none: {
          classeId,
          disciplinaId,
          trimestreId,
        },
      },
      Matricula: {
        some: {
          classeId,
          turmaId,
        },
      },
      ...whereCursorClause,
    },
    select: {
      id: true,
      nomeCompleto: true,
    },
    take: limit,
    orderBy: { id: 'desc' },
  });

  return alunos;
}

export async function getAlunoClasses(id: number) {
  const alunoClasses = await prisma.matricula.findMany({
    where: { alunoId: id },
    select: {
      Classe: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return {
    data: alunoClasses.map((classe) => ({
      id: classe.Classe.id,
      nome: classe.Classe.nome,
    })),
  };
}

export async function getActualAlunoClasse(alunoId: number) {
  const matricula = await prisma.matricula.findFirst({
    where: { alunoId },
    select: {
      Classe: {
        select: {
          id: true,
          nome: true,
          ordem: true,
          valorMatricula: true,
          Curso: { select: { id: true, nome: true } },
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return matricula
    ? {
        id: matricula.Classe.id,
        nome: matricula.Classe.nome,
        ordem: matricula.Classe.ordem,
        valorMatricula: Number(matricula.Classe.valorMatricula.toFixed(2)),
        curso: matricula.Classe.Curso,
      }
    : matricula;
}
