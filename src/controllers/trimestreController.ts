import { FastifyReply, FastifyRequest } from 'fastify';
import { createTrimestreBodyType } from '../schemas/trimestreSchemas';

export async function createTrimestreController(
  request: FastifyRequest<{ Body: createTrimestreBodyType }>,
  reply: FastifyReply
) {
  const { numero, inicio, termino } = request.body;
  return reply.send({ numero, inicio, termino });
}
