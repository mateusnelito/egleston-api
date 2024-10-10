import { FastifyReply, FastifyRequest } from 'fastify';
import { getAlunosWithoutNotaQueryStringDataType } from '../schemas/notaSchema';
import { getAlunosWithoutNotas } from '../services/alunoServices';

export async function getAlunosWithoutNotaController(
  request: FastifyRequest<{
    Querystring: getAlunosWithoutNotaQueryStringDataType;
  }>,
  reply: FastifyReply
) {
  const { query } = request;
  return reply.send(await getAlunosWithoutNotas(query));
}
