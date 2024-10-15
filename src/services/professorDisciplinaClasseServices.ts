import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
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
  // Fetch all classes, their corresponding disciplines, and groups by professor and class
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

  // Object to group 'turmas' (classes) by their ID and aggregate their disciplines
  const turmaMap: Record<number, any> = {};

  // Loop through each result to group disciplines by 'turma'
  professorClasses.forEach(({ Turma: turma, Disciplina: disciplina }) => {
    // If the turma is not yet in the map, initialize it with an empty disciplines array
    if (!turmaMap[turma.id]) {
      turmaMap[turma.id] = {
        id: turma.id,
        nome: turma.nome,
        disciplinas: [],
      };
    }
    // Add the discipline to the corresponding turma's disciplines array
    turmaMap[turma.id].disciplinas.push(disciplina);
  });

  // Convert the 'turmaMap' object back into an array of turmas
  const turmas = Object.values(turmaMap);

  // Return the result in the expected format
  return { data: turmas };
}
