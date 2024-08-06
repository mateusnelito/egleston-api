import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCursoDisciplinaBodyType,
  createDisciplinaBodyType,
  disciplinaParamsType,
  getDisciplinasQueryStringType,
  updateDisciplinaBodyType,
} from '../schemas/disciplinaSchema';
import {
  createMultiplesCursoDisciplinaByDisciplina,
  getCursoDisciplina,
} from '../services/cursosDisciplinasServices';
import { getCursoId } from '../services/cursoServices';
import {
  createDisciplina,
  getDisciplina,
  getDisciplinaId,
  getDisciplinaNome,
  getDisciplinas,
  updateDisciplina,
} from '../services/disciplinaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import { arrayHasDuplicatedValue } from '../utils/utils';

function throwNotDisciplinaIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da disciplina não existe.',
  });
}

function throwInvalidNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome da disciplina inválido.',
    errors: { nome: ['O nome da disciplina já existe.'] },
  });
}

export async function createDisciplinaController(
  request: FastifyRequest<{ Body: createDisciplinaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isDisciplinaNome = await getDisciplinaNome(nome);
  if (isDisciplinaNome) throwInvalidNomeError();

  const disciplina = await createDisciplina(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(disciplina);
}

export async function updateDisciplinaController(
  request: FastifyRequest<{
    Params: disciplinaParamsType;
    Body: updateDisciplinaBodyType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const { nome } = request.body;

  const [isDisciplinaId, disciplina] = await Promise.all([
    await getDisciplinaId(disciplinaId),
    await getDisciplinaNome(nome),
  ]);

  if (!isDisciplinaId) throwNotDisciplinaIdError();
  if (disciplina && disciplina.id !== disciplinaId) throwInvalidNomeError();

  const disciplinaUpdated = await updateDisciplina(disciplinaId, request.body);
  return reply.send(disciplinaUpdated);
}

export async function getDisciplinaController(
  request: FastifyRequest<{
    Params: disciplinaParamsType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const isDisciplinaId = await getDisciplina(disciplinaId);
  if (!isDisciplinaId) throwNotDisciplinaIdError();
  return reply.send(isDisciplinaId);
}

export async function getDisciplinasController(
  request: FastifyRequest<{
    Querystring: getDisciplinasQueryStringType;
  }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const cursos = await getDisciplinas(page_size, cursor);

  let next_cursor =
    cursos.length === page_size ? cursos[cursos.length - 1].id : undefined;

  return reply.send({
    data: cursos,
    next_cursor,
  });
}

export async function createMultiplesCursoDisciplinaByDisciplinaController(
  request: FastifyRequest<{
    Body: createCursoDisciplinaBodyType;
    Params: disciplinaParamsType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const { cursos } = request.body;

  if (arrayHasDuplicatedValue(cursos)) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Cursos inválidos.',
      errors: {
        cursos: ['O array de cursos não pode conter items duplicados.'],
      },
    });
  }

  const isDisciplinaId = await getDisciplinaId(disciplinaId);
  if (!isDisciplinaId) throwNotDisciplinaIdError();

  for (let i = 0; i < cursos.length; i++) {
    const cursoId = cursos[i];

    const [isCursoId, isCursoDisciplina] = await Promise.all([
      await getCursoId(cursoId),
      await getCursoDisciplina(cursoId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids cursos
    if (!isCursoId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Curso inválido.',
        errors: {
          cursos: {
            [i]: 'ID do curso não existe.',
          },
        },
      });
    }

    if (isCursoDisciplina) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Curso inválido.',
        errors: {
          cursos: {
            [i]: 'cursoId Já está registrado com a disciplina.',
          },
        },
      });
    }
  }

  const cursoDisciplinas = await createMultiplesCursoDisciplinaByDisciplina(
    disciplinaId,
    cursos
  );

  // TODO: Send an appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(cursoDisciplinas);
}
