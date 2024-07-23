import { FastifyReply, FastifyRequest } from 'fastify';
import { postTurnoBodyType } from '../schemas/turnoSchemas';
import HttpStatusCodes from '../utils/HttpStatusCodes';

export async function createTurnoController(
  request: FastifyRequest<{ Body: postTurnoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;
  return reply.status(HttpStatusCodes.CREATED).send({
    id: 189,
    nome,
    inicio,
    termino,
  });
}
