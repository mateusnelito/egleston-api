import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCursoBodyType,
  getCursosQueryStringType,
  uniqueCursoResourceParamsType,
  updateCursoBodyType,
} from '../schemas/cursoSchema';
import {
  changeCurso,
  getCursoDetails,
  getCursoId,
  getCursoNome,
  getCursos as getCursosService,
  saveCurso,
} from '../services/cursoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de curso não existe.',
  });
}

function throwNomeBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de curso inválido.',
    errors: { nome: ['O nome de curso já existe.'] },
  });
}

export async function createCurso(
  request: FastifyRequest<{ Body: createCursoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isCursoNome = await getCursoNome(nome);
  if (isCursoNome) throwNomeBadRequest();

  const curso = await saveCurso(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(curso);
}

export async function updateCurso(
  request: FastifyRequest<{
    Body: updateCursoBodyType;
    Params: uniqueCursoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { nome } = request.body;

  const [isCurso, isCursoNome] = await Promise.all([
    await getCursoId(cursoId),
    await getCursoNome(nome, cursoId),
  ]);

  if (!isCurso) throwNotFoundRequest();
  if (isCursoNome) throwNomeBadRequest();

  const curso = await changeCurso(cursoId, request.body);
  return reply.send({
    nome: curso.nome,
    descricao: curso.descricao,
    duracao: curso.duracao,
  });
}

export async function getCursos(
  request: FastifyRequest<{ Querystring: getCursosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const cursos = await getCursosService(page_size, cursor);

  let next_cursor =
    cursos.length === page_size ? cursos[cursos.length - 1].id : undefined;

  return reply.send({
    data: cursos,
    next_cursor,
  });
}

export async function getCurso(
  request: FastifyRequest<{
    Params: uniqueCursoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;

  const curso = await getCursoDetails(cursoId);
  if (!curso) throwNotFoundRequest();

  return reply.send(curso);
}
