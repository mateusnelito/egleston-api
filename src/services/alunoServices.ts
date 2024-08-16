import { prisma } from '../lib/prisma';
import { updateAlunoBodyType } from '../schemas/alunoSchemas';
import { createMatriculaBodyType } from '../schemas/matriculaSchemas';
import { formatDate } from '../utils/utils';

export async function createAlunoWithMatricula(
  matriculaData: createMatriculaBodyType
) {
  // Retrieving aluno data
  const { aluno: alunoData } = matriculaData;

  // Persiste data in transaction
  return prisma.$transaction(async (transaction) => {
    // Persist aluno, alunoEndereco, alunoContacto and matricula data
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
      // Define the field that must be retrieved from db after insert
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

    const matricula = aluno.Matricula[0];

    // Formatting the return data
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
        // In this point all the responsaveis are saved on db
        responsaveis: matriculaData.aluno.responsaveis.length,
      },
      classe: matricula.Classe.nome,
      curso: matricula.Curso.nome,
      turma: matricula.Turma.nome,
      turno: matricula.Turma.Turno.nome,
      createdAt: matricula.createdAt,
    };
  });
}

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
      responsaveis: aluno._count.Responsaveis,
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
  return await prisma.responsavel.findMany({
    where: { alunoId },
    select: { id: true, nomeCompleto: true },
  });
}
