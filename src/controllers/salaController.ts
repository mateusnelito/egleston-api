import { FastifyReply, FastifyRequest } from 'fastify';
import { postSalaBodyType, salaParamsType } from '../schemas/salaSchemas';
import {
  changeSala,
  getSalaByNome,
  getSalaId,
  saveSala,
} from '../services/salaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNomeAlreadyExist() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

function throwNotFoundSala() {
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

  if (!isSala) throwNotFoundSala();
  if (sala && sala.id !== salaId) throwNomeAlreadyExist();

  const updatedSala = await changeSala(salaId, request.body);
  return reply.send(updatedSala);
}
