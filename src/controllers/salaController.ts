import { FastifyReply, FastifyRequest } from 'fastify';
import { postSalaBodyType } from '../schemas/salaSchemas';
import { getSalaNome, saveSala } from '../services/salaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';

function throwNomeAlreadyExist() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome inválido',
    errors: { nome: ['Nome já existe.'] },
  });
}

export async function createSalaController(
  request: FastifyRequest<{ Body: postSalaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;
  const isSalaNome = await getSalaNome(nome);

  if (isSalaNome) throwNomeAlreadyExist();
  const sala = await saveSala(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(sala);
}
