import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createProfessorBodyType,
  createProfessorDisciplinaClasseAssociationBodyType,
  deleteProfessorDisciplinaParamsType,
  getProfessoresQueryStringType,
  professorDisciplinaBodyType,
  professorParamsType,
  updateProfessorBodyType,
} from '../schemas/professorSchemas';
import {
  getClasseAndAnoLectivoActivoStatus,
  getClasseId,
} from '../services/classeServices';
import { getDisciplinaId } from '../services/disciplinaServices';
import {
  createMultiplesDisciplinaProfessorByProfessor,
  deleteDisciplinaProfessor,
  deleteMultiplesDisciplinaProfessorByProfessor,
  getDisciplinaProfessor,
} from '../services/disciplinasProfessoresServices';
import { getEmail, getTelefone } from '../services/professorContactoServices';
import {
  createProfessor,
  getProfessor,
  getProfessorId,
  getProfessores,
  updateProfessor,
} from '../services/professorServices';
import { getTurmaByIdAndClasse } from '../services/turmaServices';
import BadRequest from '../utils/BadRequest';
import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import {
  throwInvalidDisciplinasArrayError,
  throwNotFoundDisciplinaIdInArrayError,
} from '../utils/controllers/disciplinaControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  arrayHasDuplicatedValue,
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
  throwDuplicatedEmailError,
  throwDuplicatedTelefoneError,
  throwInvalidDataNascimentoError,
} from '../utils/utilsFunctions';
import {
  createProfessorDisciplinaClasse,
  getProfessorDisciplinaClasseById,
} from '../services/professorDisciplinaClasseServices';

function throwNotFoundProfessorIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Professor não existe.',
  });
}

const MAXIMUM_AGE = 80;

export async function createProfessorController(
  request: FastifyRequest<{ Body: createProfessorBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { disciplinas, dataNascimento } = data;
  const { telefone, email } = data.contacto;

  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const professorAge = calculateTimeBetweenDates(
    dataNascimento,
    new Date(),
    'y'
  );
  if (professorAge > MAXIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade maior que ${MAXIMUM_AGE} anos.`);
  }

  if (disciplinas && arrayHasDuplicatedValue(disciplinas))
    throwInvalidDisciplinasArrayError();

  const [isProfessorTelefone, isProfessorEmail] = await Promise.all([
    getTelefone(telefone),
    email ? getEmail(email) : null,
  ]);

  if (isProfessorTelefone) throwDuplicatedTelefoneError();
  if (isProfessorEmail) throwDuplicatedEmailError();

  if (disciplinas) {
    disciplinas.forEach(async (disciplinaId, index) => {
      const disciplina = await getDisciplinaId(disciplinaId);
      if (!disciplina) {
        throwNotFoundDisciplinaIdInArrayError(
          index,
          'ID da disciplina não existe.'
        );
      }
    });
  }

  const professor = await createProfessor(request.body);
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
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const professorAge = calculateTimeBetweenDates(
    dataNascimento,
    new Date(),
    'y'
  );
  if (professorAge > MAXIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade maior que ${MAXIMUM_AGE} anos.`);
  }

  const [isProfessorId, professorTelefone, professorEmail] = await Promise.all([
    getProfessorId(professorId),
    getTelefone(telefone),
    email ? getEmail(email) : null,
  ]);

  if (!isProfessorId) throwNotFoundProfessorIdError();
  if (professorTelefone && professorTelefone.professorId !== professorId)
    throwDuplicatedTelefoneError();

  if (professorEmail && professorEmail.professorId !== professorId)
    throwDuplicatedEmailError();

  const professor = await updateProfessor(professorId, request.body);
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

  if (!professor) throw throwNotFoundProfessorIdError();

  return reply.send(professor);
}

export async function getProfessoresController(
  request: FastifyRequest<{ Querystring: getProfessoresQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const professores = await getProfessores(page_size, cursor);

  let next_cursor =
    professores.length === page_size
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

export async function createMultiplesProfessorDisciplinaByProfessorController(
  request: FastifyRequest<{
    Body: professorDisciplinaBodyType;
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedValue(disciplinas)) throwInvalidDisciplinasArrayError();

  const isProfessorId = await getProfessorId(professorId);

  if (!isProfessorId) throwNotFoundProfessorIdError();

  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];

    const [isDisciplinaId, isDisciplinaProfessor] = await Promise.all([
      getDisciplinaId(disciplinaId),
      getDisciplinaProfessor(professorId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplinaId)
      throwNotFoundDisciplinaIdInArrayError(index, 'Disciplina não existe.');

    if (isDisciplinaProfessor)
      throwNotFoundDisciplinaIdInArrayError(
        index,
        'Disciplina já associada ao professor.'
      );
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

  if (!isProfessorDisciplina) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Disciplina não associada ao professor.',
    });
  }

  const professorDisciplina = await deleteDisciplinaProfessor(
    professorId,
    disciplinaId
  );

  // TODO: SEND A CORRECT RESPONSE
  return reply.send(professorDisciplina);
}

export async function deleteMultiplesProfessorDisciplinaByProfessorController(
  request: FastifyRequest<{
    Body: professorDisciplinaBodyType;
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedValue(disciplinas)) throwInvalidDisciplinasArrayError();

  const isProfessorId = await getProfessorId(professorId);
  if (!isProfessorId) throwNotFoundProfessorIdError();

  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];

    const isProfessorDisciplina = await getDisciplinaProfessor(
      professorId,
      disciplinaId
    );

    if (!isProfessorDisciplina)
      throwNotFoundDisciplinaIdInArrayError(
        index,
        'Disciplina não associada ao professor.'
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

// TODO: SEE WITH GPT HOW TO OPTIMIZE THIS CONTROLLER
export async function createProfessorDisciplinaClasseAssociationController(
  request: FastifyRequest<{
    Params: professorParamsType;
    Body: createProfessorDisciplinaClasseAssociationBodyType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { classeId, disciplinaId, turmaId } = request.body;

  const [
    professor,
    disciplinaProfessor,
    classe,
    turma,
    professorDisciplinaClasse,
  ] = await Promise.all([
    getProfessorId(professorId),
    getDisciplinaProfessor(professorId, disciplinaId),
    getClasseAndAnoLectivoActivoStatus(classeId),
    getTurmaByIdAndClasse(turmaId, classeId),
    getProfessorDisciplinaClasseById(
      professorId,
      disciplinaId,
      classeId,
      turmaId
    ),
  ]);

  if (!professor) throwNotFoundProfessorIdError();

  if (!disciplinaProfessor) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Disciplina inválida',
      errors: {
        disciplinaId: ['Disciplina não associada ao professor.'],
      },
    });
  }

  if (!classe) throwNotFoundClasseIdFieldError();

  if (!classe!.AnoLectivo.activo) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Classe inválida.',
      errors: {
        // TODO: MAKE THIS ERROR MESSAGE BETTER
        classeId: ['Classe *Passada.'],
      },
    });
  }

  if (!turma) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Turma inválida',
      errors: {
        turmaId: ['Turma não associada a classe.'],
      },
    });
  }

  if (professorDisciplinaClasse) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Professor já associado a classe.',
    });
  }

  const newProfessorDisciplinaClasse = await createProfessorDisciplinaClasse({
    professorId,
    disciplinaId,
    classeId,
    turmaId,
  });

  // TODO: ADICIONAR LIMITE MÁXIMO PARA O Nº DE DISCIPLINA QUE UM PROFESSOR PÔDE LECIONAR EM UM CLASSE

  return reply.send(newProfessorDisciplinaClasse);
}
