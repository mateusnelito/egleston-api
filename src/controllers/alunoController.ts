import { FastifyReply, FastifyRequest } from 'fastify';

export async function createAluno(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send({
    message: 'Aluno created...',
  });
}
