import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createDisciplinaBodyType,
  disciplinaParamsType,
  getDisciplinasQueryStringType,
  updateDisciplinaBodyType,
} from '../schemas/disciplinaSchema';
import {
  createDisciplina,
  getDisciplina,
  getDisciplinaId,
  getDisciplinaNome,
  getDisciplinas,
  updateDisciplina,
} from '../services/disciplinaServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';

export async function createDisciplinaController(
  request: FastifyRequest<{ Body: createDisciplinaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isDisciplinaNome = await getDisciplinaNome(nome);
  if (isDisciplinaNome)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Disciplina inválida.', {
      nome: ['Nome da disciplina já existe.'],
    });

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

  if (!isDisciplinaId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Disciplina não encontrada.'
    );

  if (disciplina && disciplina.id !== disciplinaId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Disciplina inválida.', {
      nome: ['Nome da disciplina já existe.'],
    });

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

  if (!isDisciplinaId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Disciplina não encontrada.'
    );

  return reply.send(isDisciplinaId);
}

export async function getDisciplinasController(
  request: FastifyRequest<{
    Querystring: getDisciplinasQueryStringType;
  }>,
  reply: FastifyReply
) {
  const { cursor, pageSize: pageSize } = request.query;
  const cursos = await getDisciplinas(pageSize, cursor);

  let next_cursor =
    cursos.length === pageSize ? cursos[cursos.length - 1].id : undefined;

  return reply.send({
    data: cursos,
    next_cursor,
  });
}
