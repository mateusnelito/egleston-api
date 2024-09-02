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
import { throwInvalidCursoIdInArrayError } from '../utils/controllers/cursoControllerUtils';
import {
  throwDuplicatedDisciplinaNomeError,
  throwNotFoundDisciplinaIdError,
} from '../utils/controllers/disciplinaControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { arrayHasDuplicatedValue } from '../utils/utilsFunctions';

export async function createDisciplinaController(
  request: FastifyRequest<{ Body: createDisciplinaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isDisciplinaNome = await getDisciplinaNome(nome);
  if (isDisciplinaNome) throwDuplicatedDisciplinaNomeError();

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
    getDisciplinaId(disciplinaId),
    getDisciplinaNome(nome),
  ]);

  if (!isDisciplinaId) throwNotFoundDisciplinaIdError();
  if (disciplina && disciplina.id !== disciplinaId)
    throwDuplicatedDisciplinaNomeError();

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

  if (!isDisciplinaId) throwNotFoundDisciplinaIdError();
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
        cursos: 'O array de cursos não pode conter items duplicados.',
      },
    });
  }

  const isDisciplinaId = await getDisciplinaId(disciplinaId);
  if (!isDisciplinaId) throwNotFoundDisciplinaIdError();

  for (let i = 0; i < cursos.length; i++) {
    const cursoId = cursos[i];

    const [isCursoId, isCursoDisciplina] = await Promise.all([
      getCursoId(cursoId),
      getCursoDisciplina(cursoId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids cursos
    if (!isCursoId)
      throwInvalidCursoIdInArrayError(i, 'ID do curso não existe.');

    if (isCursoDisciplina)
      throwInvalidCursoIdInArrayError(
        i,
        'cursoId Já está registrado com a disciplina.'
      );
  }

  const cursoDisciplinas = await createMultiplesCursoDisciplinaByDisciplina(
    disciplinaId,
    cursos
  );

  // TODO: Send an appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(cursoDisciplinas);
}
