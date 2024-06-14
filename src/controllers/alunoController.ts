import { FastifyReply, FastifyRequest } from 'fastify';
import { getAlunoByNumeroBi, saveAluno } from '../services/alunoServices';
import { CreateAlunoBodyType } from '../schemas/alunoSchema';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import BadRequest from '../utils/BadRequest';

export async function createAluno(
  // Define that the Generic Type of Body is CreateAlunoBodyType
  request: FastifyRequest<{ Body: CreateAlunoBodyType }>,
  reply: FastifyReply
) {
  const { numeroBi } = request.body;
  const aluno = await getAlunoByNumeroBi(numeroBi);

  if (aluno) {
    throw new BadRequest('Número de BI inválido.', {
      numeroBi: ['Já existe um aluno com o mesmo número de BI'],
    });
  }

  const { id } = await saveAluno(request.body);
  return reply.status(HttpStatusCodes.CREATED).send({ id });
}
