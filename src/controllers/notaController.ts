import { FastifyReply, FastifyRequest } from 'fastify';
import { getAlunosWithoutNotaQueryStringDataType } from '../schemas/alunoNotaSchema';

export async function getAlunosWithoutNota(
  request: FastifyRequest<{
    Querystring: getAlunosWithoutNotaQueryStringDataType;
  }>,
  reply: FastifyReply
) {
  const { classeId, disciplinaId, trimestreId } = request.query;

  return reply.send({
    message: 'working...',
    result: { classeId, disciplinaId, trimestreId },
  });
}
