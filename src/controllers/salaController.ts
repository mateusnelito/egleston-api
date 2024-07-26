import { FastifyReply, FastifyRequest } from 'fastify';
import { postSalaBodyType, salaParamsType } from '../schemas/salaSchemas';
import {
  changeSala,
  getSala,
  getSalaByNome,
  getSalaId,
  getSalas,
  saveSala,
} from '../services/salaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import { getTurmasBySala } from '../services/turmaServices';

function throwNomeAlreadyExist() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

function throwNotFoundSalaIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID da sala não existe.',
  });
}

export async function createSalaController(
  request: FastifyRequest<{ Body: postSalaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;
  const isSalaNome = await getSalaByNome(nome);

  if (isSalaNome) throwNomeAlreadyExist();
  const sala = await saveSala(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(sala);
}

export async function updateSalaController(
  request: FastifyRequest<{ Params: salaParamsType; Body: postSalaBodyType }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;
  const { nome } = request.body;

  const [isSala, sala] = await Promise.all([
    await getSalaId(salaId),
    await getSalaByNome(nome),
  ]);

  if (!isSala) throwNotFoundSalaIdError();
  if (sala && sala.id !== salaId) throwNomeAlreadyExist();

  const updatedSala = await changeSala(salaId, request.body);
  return reply.send(updatedSala);
}

export async function getSalaController(
  request: FastifyRequest<{ Params: salaParamsType }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;

  const sala = await getSala(salaId);

  if (!sala) throwNotFoundSalaIdError();
  return reply.send(sala);
}

export async function getSalasController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = await getSalas();
  return reply.send({ data });
}

export async function getSalaTurmasController(
  request: FastifyRequest<{ Params: salaParamsType }>,
  reply: FastifyReply
) {
  const { salaId } = request.params;
  const isSalaId = await getSalaId(salaId);

  if (!isSalaId) throwNotFoundSalaIdError();
  const turmas = await getTurmasBySala(salaId);
  return reply.send({ data: turmas });
}
