import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createParentescoBodyType,
  getParentescosQueryStringType,
  uniqueParentescoResourceParamsType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';
import {
  changeParentesco,
  getParentescos as getAllParentescos,
  getParentescoById,
  getParentescoNome,
  saveParentesco,
} from '../services/parentescoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de parentesco não existe.',
  });
}

function throwNomeBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de parentesco inválido.',
    errors: { nome: ['O nome de parentesco já existe.'] },
  });
}

export async function createParentesco(
  request: FastifyRequest<{ Body: createParentescoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isParentescoNome = await getParentescoNome(nome);
  if (isParentescoNome) throwNomeBadRequest();

  const parentesco = await saveParentesco(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(parentesco);
}

export async function updateParentesco(
  request: FastifyRequest<{
    Body: updateParentescoBodyType;
    Params: uniqueParentescoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { parentescoId } = request.params;
  const { nome } = request.body;

  const [isParentesco, isParentescoNome] = await Promise.all([
    await getParentescoById(parentescoId),
    await getParentescoNome(nome, parentescoId),
  ]);

  if (!isParentesco) throwNotFoundRequest();
  if (isParentescoNome) throwNomeBadRequest();

  const parentesco = await changeParentesco(parentescoId, request.body);
  return reply.send({ nome: parentesco.nome });
}

export async function getParentescos(
  request: FastifyRequest<{ Querystring: getParentescosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;

  const parentescos = await getAllParentescos(page_size, cursor);

  let next_cursor =
    parentescos.length === page_size
      ? parentescos[parentescos.length - 1].id
      : undefined;

  return reply.send({
    data: parentescos,
    next_cursor,
  });
}

export async function getParentesco(
  request: FastifyRequest<{
    Params: uniqueParentescoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { parentescoId } = request.params;

  const parentesco = await getParentescoById(parentescoId);
  if (!parentesco) throwNotFoundRequest();

  return reply.send(parentesco);
}
