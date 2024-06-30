import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createDisciplinaBodyType,
  getDisciplinasQueryStringType,
  uniqueDisciplinaResourceParamsType,
  updateDisciplinaBodyType,
} from '../schemas/disciplinaSchema';
import {
  changeDisciplina,
  getDisciplinaDetails,
  getDisciplinaId,
  getDisciplinaNome,
  getDisciplinas as getDisciplinasService,
  saveDisciplina,
} from '../services/disciplinaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id da disciplina não existe.',
  });
}

function throwNomeBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome da disciplina inválido.',
    errors: { nome: ['O nome da disciplina já existe.'] },
  });
}

export async function createDisciplina(
  request: FastifyRequest<{ Body: createDisciplinaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isDisciplinaNome = await getDisciplinaNome(nome);
  if (isDisciplinaNome) throwNomeBadRequest();

  const curso = await saveDisciplina(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(curso);
}

export async function updateDisciplina(
  request: FastifyRequest<{
    Params: uniqueDisciplinaResourceParamsType;
    Body: updateDisciplinaBodyType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const { nome } = request.body;

  const [isDisciplina, isDisciplinaNome] = await Promise.all([
    await getDisciplinaId(disciplinaId),
    await getDisciplinaNome(nome, disciplinaId),
  ]);

  if (!isDisciplina) throwNotFoundRequest();
  if (isDisciplinaNome) throwNomeBadRequest();

  const disciplina = await changeDisciplina(disciplinaId, request.body);
  return reply.send({
    nome: disciplina.nome,
    descricao: disciplina.descricao,
  });
}

export async function getDisciplina(
  request: FastifyRequest<{
    Params: uniqueDisciplinaResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const disciplina = await getDisciplinaDetails(disciplinaId);
  if (!disciplina) throwNotFoundRequest();
  return reply.send(disciplina);
}

export async function getDisciplinas(
  request: FastifyRequest<{
    Querystring: getDisciplinasQueryStringType;
  }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const cursos = await getDisciplinasService(page_size, cursor);

  let next_cursor =
    cursos.length === page_size ? cursos[cursos.length - 1].id : undefined;

  return reply.send({
    data: cursos,
    next_cursor,
  });
}
