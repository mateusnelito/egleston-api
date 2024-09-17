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
import { getClasseAnoLectivoAndCursoById } from '../services/classeServices';
import { getCursoDisciplina } from '../services/cursosDisciplinasServices';
import { getDisciplinaId } from '../services/disciplinaServices';
import {
  createMultiplesDisciplinaProfessorByProfessor,
  deleteDisciplinaProfessor,
  deleteMultiplesDisciplinaProfessorByProfessor,
  getDisciplinaProfessor,
} from '../services/disciplinasProfessoresServices';
import { getEmail, getTelefone } from '../services/professorContactoServices';
import {
  createProfessorDisciplinaClasse,
  getProfessorDisciplinaClasseById,
  getTotalProfessorDisciplina,
} from '../services/professorDisciplinaClasseServices';
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
  throwInvalidDisciplinaIdFieldError,
  throwInvalidDisciplinasArrayError,
  throwNotFoundDisciplinaIdInArrayError,
} from '../utils/controllers/disciplinaControllerUtils';
import {
  MAXIMUM_PROFESSOR_AGE,
  MAXIMUM_PROFESSOR_DISCIPLINA_CLASSE,
  throwNotFoundProfessorIdError,
} from '../utils/controllers/professorControllerUtils';
import { throwNotFoundTurmaIdFieldError } from '../utils/controllers/turmaControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  arrayHasDuplicatedItems,
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
  throwDuplicatedEmailError,
  throwDuplicatedTelefoneError,
  throwInvalidDataNascimentoError,
} from '../utils/utilsFunctions';

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

  if (professorAge > MAXIMUM_PROFESSOR_AGE) {
    throwInvalidDataNascimentoError(
      `Idade maior que ${MAXIMUM_PROFESSOR_AGE} anos.`
    );
  }

  if (disciplinas && arrayHasDuplicatedItems(disciplinas))
    throwInvalidDisciplinasArrayError();

  const [isProfessorTelefone, isProfessorEmail] = await Promise.all([
    getTelefone(telefone),
    email ? getEmail(email) : null,
  ]);

  if (isProfessorTelefone) throwDuplicatedTelefoneError();
  if (isProfessorEmail) throwDuplicatedEmailError();

  if (disciplinas) {
    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    for (let index = 0; index < disciplinas.length; index++) {
      const disciplina = await getDisciplinaId(disciplinas[index]);
      if (!disciplina)
        throwNotFoundDisciplinaIdInArrayError(index, 'Disciplina não existe.');
    }
  }

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
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const professorAge = calculateTimeBetweenDates(
    dataNascimento,
    new Date(),
    'y'
  );

  if (professorAge > MAXIMUM_PROFESSOR_AGE) {
    throwInvalidDataNascimentoError(
      `Idade maior que ${MAXIMUM_PROFESSOR_AGE} anos.`
    );
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

export async function createMultiplesProfessorDisciplinaAssociationController(
  request: FastifyRequest<{
    Body: professorDisciplinaBodyType;
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedItems(disciplinas)) throwInvalidDisciplinasArrayError();

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

export async function deleteMultiplesProfessorDisciplinaAssociationController(
  request: FastifyRequest<{
    Body: professorDisciplinaBodyType;
    Params: professorParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedItems(disciplinas)) throwInvalidDisciplinasArrayError();

  const isProfessorId = await getProfessorId(professorId);

  if (!isProfessorId) throwNotFoundProfessorIdError();

  // TODO: Finish the verification before send the errors, to send all invalids disciplinas
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

  if (!professor) throwNotFoundProfessorIdError();

  const [classe, disciplinaProfessor, turma] = await Promise.all([
    getClasseAnoLectivoAndCursoById(classeId),
    getDisciplinaProfessor(professorId, disciplinaId),
    getTurmaByIdAndClasse(turmaId, classeId),
  ]);

  if (!classe) throwNotFoundClasseIdFieldError();

  if (!classe!.AnoLectivo.activo)
    throwNotFoundClasseIdFieldError(
      'Classe não associada ao ano-lectivo activo.'
    );

  if (!disciplinaProfessor)
    throwInvalidDisciplinaIdFieldError(
      'Disciplina não associada ao professor.'
    );

  if (!turma) throwNotFoundTurmaIdFieldError('Turma não associada a classe.');

  const [
    totalProfessorDisciplinaClasse,
    cursoDisciplina,
    professorDisciplinaClasse,
  ] = await Promise.all([
    getTotalProfessorDisciplina(professorId, classeId, turmaId),
    getCursoDisciplina(classe!.Curso.id, disciplinaId),
    getProfessorDisciplinaClasseById(
      professorId,
      disciplinaId,
      classeId,
      turmaId
    ),
  ]);

  if (totalProfessorDisciplinaClasse >= MAXIMUM_PROFESSOR_DISCIPLINA_CLASSE) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message:
        'Número máximo de disciplina que o professor pôde lecionar a classe atingido.',
    });
  }

  if (!cursoDisciplina)
    throwInvalidDisciplinaIdFieldError(
      'Disciplina não associada ao curso associado a classe.'
    );

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

  return reply
    .status(HttpStatusCodes.CREATED)
    .send(newProfessorDisciplinaClasse);
}
