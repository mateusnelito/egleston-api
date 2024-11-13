import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createProfessorBodyType,
  createProfessorDisciplinaClasseAssociationBodyType,
  deleteProfessorDisciplinaParamsType,
  getProfessorDisciplinaClassesParamsType,
  getProfessorDisciplinaClasseTurmasParamsType,
  getProfessoresQueryStringType,
  professorDisciplinaBodyType,
  professorParamsType,
  updateProfessorBodyType,
} from '../schemas/professorSchemas';
import {
  getClasseAnoLectivoAndCursoById,
  getClasseId,
} from '../services/classeServices';
import { getCursoDisciplina } from '../services/cursosDisciplinasServices';
import { getDisciplinaId } from '../services/disciplinaServices';
import {
  createMultiplesDisciplinaProfessorByProfessor,
  deleteDisciplinaProfessor,
  deleteMultiplesDisciplinaProfessorByProfessor,
  getDisciplinaProfessor,
  getProfessorDisciplinas,
} from '../services/disciplinasProfessoresServices';
import { getEmail, getTelefone } from '../services/professorContactoServices';
import {
  createProfessorDisciplinaClasse,
  getDisciplinaClasse,
  getProfessorClasses,
  getProfessorClasseTurmas,
  getProfessorDisciplinaClasseById,
  getTotalProfessorDisciplina,
} from '../services/professorDisciplinaClasseServices';
import {
  createProfessor,
  getProfessor,
  getProfessores,
  getProfessorId,
  updateProfessor,
} from '../services/professorServices';
import { getTurmaByIdAndClasse } from '../services/turmaServices';
import {
  MAXIMUM_PROFESSOR_AGE,
  MAXIMUM_PROFESSOR_DISCIPLINA_CLASSE,
} from '../utils/constants';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  arrayHasDuplicatedItems,
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
  throwValidationError,
} from '../utils/utilsFunctions';

export async function createProfessorController(
  request: FastifyRequest<{ Body: createProfessorBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { disciplinas, dataNascimento } = data;
  const { telefone, email } = data.contacto;

  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Professor inválido.', {
      dataNascimento: ['Data de nascimento não pôde estar no futuro.'],
    });

  const professorAge = calculateTimeBetweenDates(
    dataNascimento,
    new Date(),
    'y'
  );

  if (professorAge > MAXIMUM_PROFESSOR_AGE) {
    throwValidationError(HttpStatusCodes.CONFLICT, 'Professor inválido.', {
      dataNascimento: [`Idade maior que ${MAXIMUM_PROFESSOR_AGE} anos.`],
    });
  }

  if (disciplinas && arrayHasDuplicatedItems(disciplinas))
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplinas inválidas.',
      { disciplinas: ['Disciplinas devem ser únicas.'] }
    );

  const [isProfessorTelefone, isProfessorEmail] = await Promise.all([
    getTelefone(telefone),
    email ? getEmail(email) : null,
  ]);

  if (isProfessorTelefone)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Professor inválido.', {
      contacto: {
        telefone: ['Telefone já existe.'],
      },
    });

  if (isProfessorEmail)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Professor inválido.', {
      contacto: {
        email: ['Email já existe.'],
      },
    });

  if (disciplinas) {
    for (let index = 0; index < disciplinas.length; index++) {
      const disciplina = await getDisciplinaId(disciplinas[index]);

      if (!disciplina)
        throwValidationError(
          HttpStatusCodes.NOT_FOUND,
          'Disciplina inválida.',
          { disciplinas: { index: ['Disciplina não encontrada.'] } }
        );
    }
  }

  // TODO: VERIFICAR SE A DISCIPLINA PRETENDIDA PARA A CLASSE JÁ ESTÁ SENDO LECIONADA POR OUTRO PROFESSOR

  const professor = await createProfessor(data);
  return reply.status(HttpStatusCodes.CREATED).send(professor);
}

export async function updateProfessorController(
  request: FastifyRequest<{
    Params: professorParamsType;
    Body: updateProfessorBodyType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { body: data } = request;
  const { dataNascimento } = data;
  const { telefone, email } = data.contacto;

  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Professor inválido.', {
      dataNascimento: ['Data de nascimento não pôde estar no futuro.'],
    });

  const professorAge = calculateTimeBetweenDates(
    dataNascimento,
    new Date(),
    'y'
  );

  if (professorAge > MAXIMUM_PROFESSOR_AGE) {
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Professor inválido.', {
      dataNascimento: [`Idade maior que ${MAXIMUM_PROFESSOR_AGE} anos.`],
    });
  }

  const [isProfessorId, professorTelefone, professorEmail] = await Promise.all([
    getProfessorId(professorId),
    getTelefone(telefone),
    email ? getEmail(email) : null,
  ]);

  if (!isProfessorId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  if (professorTelefone && professorTelefone.professorId !== professorId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Professor inválido.', {
      contacto: {
        telefone: ['Telefone já existe.'],
      },
    });

  if (professorEmail && professorEmail.professorId !== professorId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Professor inválido.', {
      contacto: {
        email: ['Email já existe.'],
      },
    });

  const professor = await updateProfessor(professorId, data);
  return reply.send(professor);
}

export async function getProfessorController(
  request: FastifyRequest<{
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const professor = await getProfessor(professorId);

  if (!professor)
    throw throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  return reply.send(professor);
}

export async function getProfessoresController(
  request: FastifyRequest<{ Querystring: getProfessoresQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, pageSize } = request.query;
  const professores = await getProfessores(pageSize, cursor);

  let next_cursor =
    professores.length === pageSize
      ? professores[professores.length - 1].id
      : undefined;

  const data = professores.map(({ id, nomeCompleto, dataNascimento }) => {
    return {
      id,
      nomeCompleto,
      dataNascimento: formatDate(dataNascimento),
    };
  });

  return reply.send({
    data,
    next_cursor,
  });
}

export async function getProfessorDisciplinaAssociationsController(
  request: FastifyRequest<{
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const professor = await getProfessorId(professorId);

  if (!professor)
    throw throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  return reply.send(await getProfessorDisciplinas(professorId));
}

export async function createMultiplesProfessorDisciplinaAssociationController(
  request: FastifyRequest<{
    Body: professorDisciplinaBodyType;
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedItems(disciplinas))
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplinas inválidas.',
      { disciplinas: ['Disciplinas devem ser únicas.'] }
    );

  const isProfessorId = await getProfessorId(professorId);

  if (!isProfessorId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];

    const [isDisciplinaId, isDisciplinaProfessor] = await Promise.all([
      getDisciplinaId(disciplinaId),
      getDisciplinaProfessor(professorId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplinaId)
      throwValidationError(HttpStatusCodes.NOT_FOUND, 'Disciplina inválida.', {
        disciplinas: { [index]: ['Disciplina não encontrada.'] },
      });

    if (isDisciplinaProfessor)
      throwValidationError(HttpStatusCodes.CONFLICT, 'Disciplina inválida.', {
        disciplinas: { [index]: ['Disciplina já associada ao professor.'] },
      });
  }

  const cursoDisciplinas = await createMultiplesDisciplinaProfessorByProfessor(
    professorId,
    disciplinas
  );

  return reply.send(cursoDisciplinas);
}

export async function deleteProfessorDisciplinaController(
  request: FastifyRequest<{
    Params: deleteProfessorDisciplinaParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId, disciplinaId } = request.params;
  const isProfessorDisciplina = await getDisciplinaProfessor(
    professorId,
    disciplinaId
  );

  if (!isProfessorDisciplina)
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplina não associada ao professor.'
    );

  const professorDisciplina = await deleteDisciplinaProfessor(
    professorId,
    disciplinaId
  );

  // TODO: SEND A CORRECT RESPONSE
  return reply.send(professorDisciplina);
}

export async function deleteMultiplesProfessorDisciplinaAssociationController(
  request: FastifyRequest<{
    Body: professorDisciplinaBodyType;
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedItems(disciplinas))
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplinas inválidas.',
      { disciplinas: ['Disciplinas devem ser únicas.'] }
    );

  const isProfessorId = await getProfessorId(professorId);

  if (!isProfessorId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  // TODO: Finish the verification before send the errors, to send all invalids disciplinas
  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];

    const isProfessorDisciplina = await getDisciplinaProfessor(
      professorId,
      disciplinaId
    );

    if (!isProfessorDisciplina)
      throwValidationError(
        HttpStatusCodes.BAD_REQUEST,
        'Disciplina inválida.',
        {
          disciplinas: { [index]: ['Disciplina não associada ao professor.'] },
        }
      );
  }

  const professorDisciplinas =
    await deleteMultiplesDisciplinaProfessorByProfessor(
      professorId,
      disciplinas
    );

  // TODO: Send an appropriate response
  return reply.send(professorDisciplinas);
}

export async function createProfessorDisciplinaClasseAssociationController(
  request: FastifyRequest<{
    Params: professorParamsType;
    Body: createProfessorDisciplinaClasseAssociationBodyType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { classeId, disciplinaId, turmaId } = request.body;

  const professor = await getProfessorId(professorId);

  if (!professor)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  const [classe, disciplinaProfessor, turma] = await Promise.all([
    getClasseAnoLectivoAndCursoById(classeId),
    getDisciplinaProfessor(professorId, disciplinaId),
    getTurmaByIdAndClasse(turmaId, classeId),
  ]);

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe inválida.', {
      classeId: ['Classe não encontrada'],
    });

  if (!classe!.AnoLectivo.activo)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Classe inválida.', {
      classeId: ['Classe não associada ao ano-lectivo activo.'],
    });

  if (!disciplinaProfessor)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Disciplina inválida.', {
      disciplinaId: ['Disciplina não associada ao professor.'],
    });

  if (!turma)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Turma inválida.', {
      turmaId: ['Turma não associada a classe'],
    });

  const [
    disciplinaClasse,
    totalProfessorDisciplinaClasse,
    cursoDisciplina,
    professorDisciplinaClasse,
  ] = await Promise.all([
    getDisciplinaClasse(disciplinaId, classeId, turmaId),
    getTotalProfessorDisciplina(professorId, classeId, turmaId),
    getCursoDisciplina(classe!.Curso.id, disciplinaId),
    getProfessorDisciplinaClasseById(
      professorId,
      disciplinaId,
      classeId,
      turmaId
    ),
  ]);

  if (disciplinaClasse)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Disciplina inválida.', {
      disciplinaId: ['Disciplina já associada a outro professor.'],
    });

  if (totalProfessorDisciplinaClasse >= MAXIMUM_PROFESSOR_DISCIPLINA_CLASSE)
    throwValidationError(
      HttpStatusCodes.FORBIDDEN,
      'Número máximo de disciplina que o professor pôde lecionar a classe atingido.'
    );

  if (!cursoDisciplina)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Disciplina inválida.', {
      disciplinaId: ['Disciplina não associada ao curso associado a classe.'],
    });

  if (professorDisciplinaClasse)
    throwValidationError(
      HttpStatusCodes.CONFLICT,
      'Professor já associado a classe.'
    );

  const newProfessorDisciplinaClasse = await createProfessorDisciplinaClasse({
    professorId,
    disciplinaId,
    classeId,
    turmaId,
  });

  return reply
    .status(HttpStatusCodes.CREATED)
    .send(newProfessorDisciplinaClasse);
}

export async function getProfessorDisciplinaClassesController(
  request: FastifyRequest<{
    Params: professorParamsType;
    Querystring: getProfessorDisciplinaClassesParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { anoLectivoId } = request.query;
  const professor = await getProfessorId(professorId);

  if (!professor)
    throw throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  const professorClasses = await getProfessorClasses(professorId, anoLectivoId);

  return reply.send(professorClasses);
}

export async function getProfessorDisciplinaClasseTurmasController(
  request: FastifyRequest<{
    Params: getProfessorDisciplinaClasseTurmasParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId, classeId } = request.params;

  const [professor, classe] = await Promise.all([
    getProfessorId(professorId),
    getClasseId(classeId),
  ]);

  if (!professor)
    throw throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Professor não encontrado.'
    );

  if (!classe)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Classe não encontrada.');

  const professorClasseTurmas = await getProfessorClasseTurmas(
    professorId,
    classeId
  );

  return reply.send(professorClasseTurmas);
}
