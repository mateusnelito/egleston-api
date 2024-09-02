import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createParentescoBodyType,
  parentescoParamsType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';
import {
  createParentesco,
  getParentescos,
  getParentesco,
  getParentescoByNome,
  getParentescoId,
  updateParentesco,
} from '../services/parentescoServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  throwDuplicatedParentescoNomeError,
  throwNotFoundParentescoIdError,
} from '../utils/controllers/parentescoControllerUtils';

export async function createParentescoController(
  request: FastifyRequest<{ Body: createParentescoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;
  const isParentescoNome = await getParentescoByNome(nome);

  if (isParentescoNome) throwDuplicatedParentescoNomeError();

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
    getParentescoId(parentescoId),
    getParentescoByNome(nome),
  ]);

  if (!isParentescoId) throwNotFoundParentescoIdError();
  if (parentesco && parentesco.id !== parentescoId)
    throwDuplicatedParentescoNomeError();

  const updatedParentesco = await updateParentesco(parentescoId, request.body);
  return reply.send(updatedParentesco);
}

export async function getParentescosController(
  _: FastifyRequest,
  reply: FastifyReply
) {
  const parentescos = await getParentescos();
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
