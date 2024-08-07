import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createProfessorBodyType,
  deleteProfessorDisciplinaParamsType,
  getProfessoresQueryStringType,
  professorDisciplinaBodyType,
  professorParamsSchema,
  updateProfessorBodyType,
} from '../schemas/professorSchemas';
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
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  arrayHasDuplicatedValue,
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
} from '../utils/utils';

function throwInvalidDataNascimentoError(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de nascimento inválida.',
    errors: { dataNascimento: [message] },
  });
}

function throwInvalidTelefoneError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Número de telefone inválido.',
    errors: { telefone: ['O número de telefone já está sendo usado.'] },
  });
}

function throwInvalidEmailError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Endereço de email inválido.',
    errors: { email: ['O endereço de email já está sendo usado.'] },
  });
}

function throwNotFoundProfessorIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de professor não existe.',
  });
}

function throwInvalidDisciplinasArrayError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Disciplinas inválidas.',
    errors: {
      disciplinas: ['disciplinas não podem conter items duplicados.'],
    },
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

  // Check dataNascimento integrity
  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const age = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');
  if (age > MAXIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade maior que ${MAXIMUM_AGE} anos.`);
  }

  // Check disciplinas integrity
  if (disciplinas && arrayHasDuplicatedValue(disciplinas))
    throwInvalidDisciplinasArrayError();

  const isProfessorTelefone = await getTelefone(telefone);
  if (isProfessorTelefone) throwInvalidTelefoneError();

  if (email) {
    const isProfessorEmail = await getEmail(email);
    if (isProfessorEmail) throwInvalidEmailError();
  }

  if (disciplinas) {
    for (let i = 0; i < disciplinas.length; i++) {
      const disciplinaId = disciplinas[i];
      const isDisciplinaId = await getDisciplinaId(disciplinaId);

      // TODO: Finish the verification before send the errors, to send all invalids disciplinas
      if (!isDisciplinaId) {
        throw new BadRequest({
          statusCode: HttpStatusCodes.NOT_FOUND,
          message: 'Disciplina inválida.',
          errors: {
            disciplinas: {
              [i]: 'ID da disciplina não existe.',
            },
          },
        });
      }
    }
  }

  const professor = await createProfessor(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(professor);
}

export async function updateProfessorController(
  request: FastifyRequest<{
    Params: professorParamsSchema;
    Body: updateProfessorBodyType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { body: data } = request;
  const { dataNascimento } = data;
  const { telefone, email } = data.contacto;

  // Check dataNascimento integrity
  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const age = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');
  if (age > MAXIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade maior que ${MAXIMUM_AGE} anos.`);
  }

  const [isProfessorId, professorTelefone] = await Promise.all([
    await getProfessorId(professorId),
    await getTelefone(telefone),
  ]);

  if (!isProfessorId) throwNotFoundProfessorIdError();
  if (professorTelefone && professorTelefone.professorId !== professorId)
    throwInvalidTelefoneError();

  if (email) {
    const professorEmail = await getEmail(email);
    if (professorEmail && professorEmail.professorId !== professorId)
      throwInvalidEmailError();
  }

  const professor = await updateProfessor(professorId, request.body);
  return reply.send(professor);
}

export async function getProfessorController(
  request: FastifyRequest<{
    Params: professorParamsSchema;
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
    Params: professorParamsSchema;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (disciplinas && arrayHasDuplicatedValue(disciplinas))
    throwInvalidDisciplinasArrayError();

  const isProfessorId = await getProfessorId(professorId);
  if (!isProfessorId) throwNotFoundProfessorIdError();

  // TODO: TRY TO SIMPLIFY THIS CODE WITH PROMISE.ALL,
  // CREATING A ARRAY WITH UNSOLVED PROMISES AND EXECUTE THEM ALL IN THE SAME TIME
  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const [isDisciplinaId, isDisciplinaProfessor] = await Promise.all([
      await getDisciplinaId(disciplinaId),
      await getDisciplinaProfessor(professorId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplinaId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'ID da disciplina não existe.',
          },
        },
      });
    }

    if (isDisciplinaProfessor) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'disciplinaId já está registrada ao professor.',
          },
        },
      });
    }
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
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Disciplina não registrada ao professor.',
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
    Params: professorParamsSchema;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  if (disciplinas && arrayHasDuplicatedValue(disciplinas))
    throwInvalidDisciplinasArrayError();

  const isProfessorId = await getProfessorId(professorId);
  if (!isProfessorId) throwNotFoundProfessorIdError();

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const isProfessorDisciplina = await getDisciplinaProfessor(
      professorId,
      disciplinaId
    );

    if (!isProfessorDisciplina) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'Disciplina não registrada ao professor.',
          },
        },
      });
    }
  }

  const professorDisciplinas =
    await deleteMultiplesDisciplinaProfessorByProfessor(
      professorId,
      disciplinas
    );

  // TODO: Send an appropriate response
  return reply.send(professorDisciplinas);
}
