import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createParentescoBodyType,
  parentescoParamsType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';
import {
  createParentesco,
  getParentescos as getAllParentescos,
  getParentesco,
  getParentescoByNome,
  getParentescoId,
  updateParentesco,
} from '../services/parentescoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundParentescoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID de parentesco não existe.',
  });
}

function throwInvalidNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de parentesco inválido.',
    errors: { nome: ['O nome de parentesco já existe.'] },
  });
}

export async function createParentescoController(
  request: FastifyRequest<{ Body: createParentescoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isParentescoNome = await getParentescoByNome(nome);
  if (isParentescoNome) throwInvalidNomeError();

  const parentesco = await createParentesco(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(parentesco);
}

export async function updateParentescoController(
  request: FastifyRequest<{
    Body: updateParentescoBodyType;
    Params: parentescoParamsType;
  }>,
  reply: FastifyReply
) {
  const { parentescoId } = request.params;
  const { nome } = request.body;

  const [isParentescoId, parentesco] = await Promise.all([
    await getParentescoId(parentescoId),
    await getParentescoByNome(nome),
  ]);

  if (!isParentescoId) throwNotFoundParentescoIdError();
  if (parentesco && parentesco.id !== parentescoId) throwInvalidNomeError();

  const updatedParentesco = await updateParentesco(parentescoId, request.body);
  return reply.send({ nome: updatedParentesco.nome });
}

export async function getParentescosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parentescos = await getAllParentescos();
  return reply.send(parentescos);
}

export async function getParentescoController(
  request: FastifyRequest<{
    Params: parentescoParamsType;
  }>,
  reply: FastifyReply
) {
  const { parentescoId } = request.params;

  const parentesco = await getParentesco(parentescoId);
  if (!parentesco) throwNotFoundParentescoIdError();

  return reply.send(parentesco);
}
