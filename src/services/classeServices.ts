import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { createClasseDataType } from '../schemas/classeSchemas';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  arrayHasDuplicatedItems,
  throwValidationError,
} from '../utils/utilsFunctions';
import { getAnoLectivoActivo, getAnoLectivoId } from './anoLectivoServices';
import { getDisciplinaId } from './disciplinaServices';

export async function getClasseByUniqueKey(
  nome: string,
  anoLectivoId: number,
  cursoId: number
) {
  return prisma.classe.findUnique({
    where: {
      nome_anoLectivoId_cursoId: { nome, anoLectivoId, cursoId },
    },
    select: { id: true },
  });
}

export async function getClasseCursoOrdem(cursoId: number, ordem: number) {
  return prisma.classe.findUnique({
    where: { cursoId_ordem: { cursoId, ordem } },
    select: { id: true },
  });
}

type createClasseRawDataType = createClasseDataType & {
  anoLectivoId: number;
};

export async function createClasse(data: createClasseRawDataType) {
  const classe = await prisma.classe.create({
    data: {
      nome: data.nome,
      ordem: data.ordem,
      anoLectivoId: data.anoLectivoId,
      cursoId: data.cursoId,
      valorMatricula: data.valorMatricula,
      ClasseDisciplinas: {
        createMany: {
          data: data.disciplinas.map((disciplinaId) => ({ disciplinaId })),
        },
      },
    },
    select: {
      id: true,
      nome: true,
      ordem: true,
      valorMatricula: true,
      Curso: { select: { id: true, nome: true } },
      _count: { select: { ClasseDisciplinas: {} } },
    },
  });

  return {
    id: classe.id,
    nome: classe.nome,
    ordem: classe.ordem,
    valorMatricula: Number(classe.valorMatricula.toFixed(2)),
    curso: classe.Curso,
    totalDisciplinas: classe._count.ClasseDisciplinas,
  };
}

export async function getClasseId(id: number) {
  return await prisma.classe.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function getClasses(
  cursoId: number,
  anoLectivoId: number | undefined
) {
  const anoLectivo = anoLectivoId ?? (await getAnoLectivoActivo())?.id;

  if (!anoLectivo)
    throw new Error('Nenhum ano lectivo activo encontrado', {
      cause:
        'Nenhum ano lectivo com status activo encontrado no banco de dados, buscando classe por ano lectivo',
    });

  const classes = await prisma.classe.findMany({
    where: { anoLectivoId: anoLectivo, cursoId },
    select: {
      id: true,
      nome: true,
      ordem: true,
      valorMatricula: true,
    },
    orderBy: { ordem: 'asc' },
  });

  return {
    data: classes.map(({ id, nome, ordem, valorMatricula }) => ({
      id,
      nome,
      ordem,
      valorMatricula: Number(valorMatricula),
    })),
  };
}

export async function getClasseDisciplinas(classeId: number) {
  const classeDisciplinas = await prisma.classeDisciplinas.findMany({
    where: { classeId },
    select: {
      Disciplina: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });

  return {
    data: classeDisciplinas.map(({ Disciplina: { id, nome } }) => ({
      id,
      nome,
    })),
  };
}

export async function getNonAssociatedClasseDisciplinas(classeId: number) {
  const disciplinas = await prisma.disciplina.findMany({
    where: {
      ClasseDisciplinas: {
        none: { classeId },
      },
    },
    select: {
      id: true,
      nome: true,
    },
  });

  return { data: disciplinas };
}

export async function validateCreateManyClasseDisciplina(
  classeId: number,
  disciplinas: number[]
) {
  if (arrayHasDuplicatedItems(disciplinas))
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Classe inválida.', {
      disciplinas: ['disciplinas não podem ser duplicadas.'],
    });

  const classe = await getClasseId(classeId);

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const [disciplina, classeDisciplina] = await Promise.all([
      getDisciplinaId(disciplinaId),
      prisma.classeDisciplinas.findUnique({
        where: { classeId_disciplinaId: { classeId, disciplinaId } },
      }),
    ]);

    if (!disciplina)
      throwValidationError(HttpStatusCodes.NOT_FOUND, 'Disciplinas inválidas', {
        disciplinas: {
          [i]: ['Disciplina não encontrada'],
        },
      });

    if (classeDisciplina)
      throwValidationError(HttpStatusCodes.CONFLICT, 'Disciplinas inválidas', {
        disciplinas: {
          [i]: ['Disciplina já associada a classe.'],
        },
      });
  }
}

export async function createManyClasseDisciplinasByClasseId(
  classeId: number,
  disciplinas: number[]
) {
  await prisma.classeDisciplinas.createMany({
    data: disciplinas.map((disciplinaId) => ({ classeId, disciplinaId })),
    skipDuplicates: true,
  });

  const createdDisciplinas = await prisma.disciplina.findMany({
    where: { id: { in: disciplinas } },
    select: { id: true, nome: true },
  });

  return { classeId, data: createdDisciplinas };
}

export async function updateClasse(
  id: number,
  data: Prisma.ClasseUncheckedUpdateInput
) {
  const classe = await prisma.classe.update({
    where: { id },
    data,
    select: {
      id: true,
      nome: true,
      ordem: true,
      valorMatricula: true,
      Curso: { select: { id: true, nome: true } },
    },
  });

  // TODO: REFACTOR, USE A FUN TO FORMAT THE RETURN OBJECT
  return {
    id: classe.id,
    nome: classe.nome,
    ordem: classe.ordem,
    valorMatricula: Number(classe.valorMatricula.toFixed(2)),
    curso: classe.Curso,
  };
}

export async function getClasse(id: number) {
  const classe = await prisma.classe.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      ordem: true,
      valorMatricula: true,
      AnoLectivo: { select: { id: true, nome: true } },
      Curso: { select: { id: true, nome: true } },
      _count: {
        select: {
          Turma: {},
        },
      },
    },
  });

  return classe
    ? {
        id: classe.id,
        nome: classe.nome,
        ordem: classe.ordem,
        valorMatricula: Number(classe.valorMatricula.toFixed(2)),
        curso: classe.Curso,
        anoLectivo: classe.AnoLectivo,
        totalTurmas: classe._count.Turma,
      }
    : classe;
}

export async function getClasseCursoWithOrdem(id: number) {
  return prisma.classe.findUnique({
    where: { id },
    select: {
      ordem: true,
      Curso: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getNextClasseByOrdem(ordem: number, cursoId: number) {
  const classe = await prisma.classe.findFirst({
    where: { cursoId, ordem: { gt: ordem } },
    select: {
      id: true,
      nome: true,
      ordem: true,
      valorMatricula: true,
      AnoLectivo: { select: { id: true, nome: true } },
    },
  });

  return classe
    ? {
        id: classe.id,
        nome: classe.nome,
        ordem: classe.ordem,
        valorMatricula: Number(classe.valorMatricula.toFixed(2)),
        anoLectivo: classe.AnoLectivo,
      }
    : classe;
}

export async function getClassesByAnoLectivo(anoLectivoId: number) {
  const classes = await prisma.classe.findMany({
    where: { anoLectivoId },
    select: {
      id: true,
      nome: true,
      Curso: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
    orderBy: {
      Curso: { nome: 'asc' },
    },
  });

  // TODO: SEARCH FOR BETTER WAY TO TYPE acc
  const groupedClassesByCurso = classes.reduce((acc: any, classe) => {
    const { Curso } = classe;
    const { id, nome } = Curso;

    if (!acc[id]) {
      acc[id] = {
        nome,
        classes: [],
      };
    }
    acc[id].classes.push({
      id: classe.id,
      nome: classe.nome,
    });

    return acc;
  }, {});

  return {
    data: {
      cursos: groupedClassesByCurso,
    },
  };
}

export async function getClassesByCurso(
  cursoId: number,
  anoLectivoId: number | null | undefined
) {
  const anoLectivo = !anoLectivoId
    ? await getAnoLectivoActivo()
    : await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo) return { data: [] };

  return {
    data: await prisma.classe.findMany({
      where: { cursoId, anoLectivoId: anoLectivo.id },
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        AnoLectivo: { nome: 'desc' },
      },
    }),
  };
}

export async function getClasseAnoLectivoAndCursoById(id: number) {
  return await prisma.classe.findUnique({
    where: { id },
    select: {
      id: true,
      AnoLectivo: { select: { id: true, activo: true } },
      Curso: { select: { id: true } },
    },
  });
}
