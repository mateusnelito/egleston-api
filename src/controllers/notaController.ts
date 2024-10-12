import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getAlunosWithoutNotaQueryStringDataType,
  notaDataType,
} from '../schemas/notaSchema';
import { getAlunosWithoutNotas } from '../services/alunoServices';
import {
  createNota,
  getNotaById,
  validateNotaData,
} from '../services/notaServices';
import { throwDuplicatedNotaError } from '../utils/controllers/notaControllerUtil';
import HttpStatusCodes from '../utils/HttpStatusCodes';

export async function createNotaController(
  request: FastifyRequest<{ Body: notaDataType }>,
  reply: FastifyReply
) {
  const { alunoId, classeId, disciplinaId, trimestreId } = request.body;

  await validateNotaData({ alunoId, classeId, disciplinaId, trimestreId });
  const nota = await getNotaById({
    alunoId,
    classeId,
    disciplinaId,
    trimestreId,
  });

  if (nota) throwDuplicatedNotaError();

  return reply
    .status(HttpStatusCodes.CREATED)
    .send(await createNota(request.body));
}

export async function getAlunosWithoutNotaController(
  request: FastifyRequest<{
    Querystring: getAlunosWithoutNotaQueryStringDataType;
  }>,
  reply: FastifyReply
) {
  const { query } = request;
  const { pageSize, cursor } = query;

  const alunos = await getAlunosWithoutNotas(query, pageSize, cursor);

  let next_cursor =
    alunos.length === pageSize ? alunos[alunos.length - 1].id : undefined;

  return reply.send({
    data: alunos,
    next_cursor,
  });
}
