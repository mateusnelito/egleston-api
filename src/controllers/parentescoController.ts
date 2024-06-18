import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createParentescoBodyType,
  getParentescosQueryStringType,
  uniqueParentescoResourceParamsType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';
import {
  getParentescos as getAllParentescos,
  changeParentesco,
  getParentescoById,
  getParentescoByNome,
  saveParentesco,
} from '../services/parentescoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

export async function createParentesco(
  request: FastifyRequest<{ Body: createParentescoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;
  const isParentesco = await getParentescoByNome(nome);

  if (isParentesco) {
    throw new BadRequest('Nome de parentesco inválido.', {
      nome: ['O nome de parentesco já existe.'],
    });
  }
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

  const isParentesco = await getParentescoById(parentescoId);

  if (!isParentesco) {
    throw new NotFoundRequest('Id de parentesco não existe.');
  }

  const isNome = await getParentescoByNome(nome, parentescoId);
  if (isNome) {
    throw new BadRequest('Nome de parentesco inválido.', {
      nome: ['O nome de parentesco já existe.'],
    });
  }
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
  const isParentesco = await getParentescoById(parentescoId);

  if (!isParentesco) {
    throw new NotFoundRequest('Id de parentesco não existe.');
  }

  const parentesco = await getParentescoById(parentescoId);
  return reply.send(parentesco);
}
