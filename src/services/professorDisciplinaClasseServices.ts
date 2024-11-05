import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { groupBy } from '../utils/utilsFunctions';
import { getAnoLectivoActivo } from './anoLectivoServices';

export async function getProfessorDisciplinaClasseById(
  professorId: number,
  disciplinaId: number,
  classeId: number,
  turmaId: number
) {
  return await prisma.professorDisciplinaClasse.findUnique({
    where: {
      professorId_disciplinaId_classeId_turmaId: {
        professorId,
        disciplinaId,
        classeId,
        turmaId,
      },
    },
  });
}

export async function createProfessorDisciplinaClasse(
  data: Prisma.ProfessorDisciplinaClasseUncheckedCreateInput
) {
  return await prisma.professorDisciplinaClasse.create({ data });
}

export async function getTotalProfessorDisciplina(
  professorId: number,
  classeId: number,
  turmaId: number
) {
  return await prisma.professorDisciplinaClasse.count({
    where: { professorId, classeId, turmaId },
  });
}

export async function getProfessorClasses(
  professorId: number,
  anoLectivoId?: number
) {
  const anoLectivo = anoLectivoId
    ? { id: anoLectivoId }
    : await getAnoLectivoActivo();

  const professorClasses = await prisma.professorDisciplinaClasse.findMany({
    where: { professorId, Classe: { anoLectivoId: anoLectivo?.id } },
    distinct: ['classeId'],
    select: {
      Classe: {
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
      },
      Turma: {
        select: { _count: { select: { ProfessorDisciplinaClasse: {} } } },
      },
    },
    orderBy: { Classe: { id: 'desc' } },
  });

  const classes = professorClasses.map(
    ({
      Classe: classe,
      Turma: {
        _count: { ProfessorDisciplinaClasse: totalTurmas },
      },
    }) => ({
      id: classe.id,
      nome: classe.nome,
      curso: {
        id: classe.Curso.id,
        nome: classe.Curso.nome,
      },
      totalTurmas,
    })
  );

  return { data: classes };
}

export async function getDisciplinaClasse(
  disciplinaId: number,
  classeId: number,
  turmaId: number
) {
  return await prisma.professorDisciplinaClasse.findFirst({
    where: { disciplinaId, classeId, turmaId },
    select: { professorId: true },
  });
}

export async function getClasseDisciplinas(classeId: number) {
  const classeDisciplinas = await prisma.professorDisciplinaClasse.findMany({
    where: { classeId },
    // TODO: THINK IF IS CORRECT RETURN THIS WAY OR USE turmaId TO CATEGORIZE
    distinct: ['disciplinaId'],
    select: { Disciplina: { select: { id: true, nome: true } } },
  });

  return {
    data: classeDisciplinas.map(({ Disciplina: disciplina }) => {
      return {
        id: disciplina.id,
        nome: disciplina.nome,
      };
    }),
  };
}

export async function getProfessorClasseTurmas(
  professorId: number,
  classeId: number
) {
  const professorClasses = await prisma.professorDisciplinaClasse.findMany({
    where: { professorId, classeId },
    select: {
      Turma: {
        select: { id: true, nome: true },
      },
      Disciplina: { select: { id: true, nome: true } },
    },
    orderBy: [{ Turma: { id: 'desc' } }, { Disciplina: { id: 'desc' } }],
  });

  const turmas = groupBy(
    professorClasses,
    ({ Turma: { id } }) => id,
    ({ Turma }) => Turma,
    ({ Disciplina }) => Disciplina,
    'disciplinas'
  );

  return { data: turmas };
}

export async function getTurmaProfessores(turmaId: number) {
  const professores = await prisma.professorDisciplinaClasse.findMany({
    where: { turmaId },
    select: {
      Professor: {
        select: {
          id: true,
          nomeCompleto: true,
        },
      },
      Disciplina: { select: { id: true, nome: true } },
    },
    orderBy: { turmaId: 'desc' },
  });

  const professoresData = groupBy(
    professores,
    ({ Professor: { id } }) => id,
    ({ Professor }) => Professor,
    ({ Disciplina: disciplina }) => disciplina,
    'disciplinas'
  );

  return { data: professoresData };
}
