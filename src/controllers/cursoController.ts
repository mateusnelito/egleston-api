import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCursoBodyType,
  cursoParamsType,
  getCursoClassesQueryType,
  updateCursoBodyType,
} from '../schemas/cursoSchema';
import { getClassesByCurso } from '../services/classeServices';
import {
  createCurso,
  getCurso,
  getCursoId,
  getCursoNome,
  getCursos,
  updateCurso,
} from '../services/cursoServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';

export async function createCursoController(
  request: FastifyRequest<{ Body: createCursoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isCursoNome = await getCursoNome(nome);
  if (isCursoNome)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Curso inválido.', {
      nome: ['O nome de curso já existe.'],
    });

  const curso = await createCurso(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(curso);
}

export async function updateCursoController(
  request: FastifyRequest<{
    Body: updateCursoBodyType;
    Params: cursoParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { nome } = request.body;

  const [isCursoId, curso] = await Promise.all([
    getCursoId(cursoId),
    getCursoNome(nome),
  ]);

  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  if (curso && curso.id !== cursoId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Curso inválido.', {
      nome: ['O nome de curso já existe.'],
    });

  const cursoUpdated = await updateCurso(cursoId, request.body);
  return reply.send(cursoUpdated);
}

export async function getCursosController(
  _: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(await getCursos());
}

export async function getCursoController(
  request: FastifyRequest<{
    Params: cursoParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;

  const curso = await getCurso(cursoId);
  if (!curso)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  return reply.send(curso);
}

export async function getCursoClassesController(
  request: FastifyRequest<{
    Params: cursoParamsType;
    Querystring: getCursoClassesQueryType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { anoLectivoId } = request.query;

  const isCursoId = await getCursoId(cursoId);

  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  const classes = await getClassesByCurso(cursoId, anoLectivoId);
  return reply.send(classes);
}
