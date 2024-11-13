import { FastifyReply, FastifyRequest } from 'fastify';
import {
  bulkNotaDataType,
  getAlunosWithoutNotaQueryStringDataType,
  notaDataType,
} from '../schemas/notaSchema';
import { getAlunosAbsentNotas } from '../services/alunoServices';
import {
  createBulkNota,
  createNota,
  getNotaById,
  validateNotaBulkCreate,
  validateNotaData,
} from '../services/notaServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';

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

  if (nota) throwValidationError(HttpStatusCodes.CONFLICT, 'Nota já existe.');

  return reply
    .status(HttpStatusCodes.CREATED)
    .send(await createNota(request.body));
}

export async function getAlunosAbsentNotaController(
  request: FastifyRequest<{
    Querystring: getAlunosWithoutNotaQueryStringDataType;
  }>,
  reply: FastifyReply
) {
  const { query } = request;
  const { pageSize, cursor } = query;

  const alunos = await getAlunosAbsentNotas(query, pageSize, cursor);

  let next_cursor =
    alunos.length === pageSize ? alunos[alunos.length - 1].id : undefined;

  return reply.send({
    data: alunos,
    next_cursor,
  });
}

export async function createBulkNotaController(
  request: FastifyRequest<{ Body: bulkNotaDataType }>,
  reply: FastifyReply
) {
  const { body: data } = request;

  await validateNotaBulkCreate(data);

  return reply.status(HttpStatusCodes.CREATED).send(await createBulkNota(data));
}
