import { prisma } from '../lib/prisma';
import { createMatriculaBodyType } from '../schemas/matriculaSchemas';
import { formatDate } from '../utils/utils';

export async function createMatricula(matriculaData: createMatriculaBodyType) {
  const {
    aluno: alunoData,
    classeId,
    metodoPagamentoId,
    anoLectivoId,
  } = matriculaData;

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
            cursoId: matriculaData.cursoId,
            turmaId: matriculaData.turmaId,
            anoLectivoId: matriculaData.anoLectivoId,
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
        Contacto: {
          select: {
            telefone: true,
            email: true,
          },
        },
        Matricula: {
          select: {
            id: true,
            createdAt: true,
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
        responsaveis: matriculaData.aluno.responsaveis.length,
      },
      classe: matricula.Classe.nome,
      curso: matricula.Curso.nome,
      turma: matricula.Turma.nome,
      turno: matricula.Turma.Turno.nome,
      anoLectivo: matricula.AnoLectivo.nome,
      createdAt: matricula.createdAt,
      pagamento: {
        id: pagamento.id,
        alunoId: pagamento.alunoId,
        valor: Number(pagamento.valor),
        descricao: pagamento.descricao,
        metodoPagamento: pagamento.MetodoPagamento.nome,
        createdAt: pagamento.createdAt,
      },
    };
  });
}

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
