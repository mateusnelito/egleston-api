import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createMetodoPagamentoBodyType,
  metodoPagamentoParamsType,
} from '../schemas/metodoPagamentoSchemas';
import {
  createMetodoPagamento,
  getMetodoPagamentoById,
  getMetodoPagamentoByNome,
  getMetodosPagamento,
  updateMetodoPagamento,
} from '../services/metodoPagamentoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwInvalidNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de metodo de pagamento inválido.',
    errors: { nome: ['O nome de metodo de pagamento já existe.'] },
  });
}

function throwNotFoundMetodoPagamentoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID de metodo de pagamento não existe.',
  });
}

export async function createMetodoPagamentoController(
  request: FastifyRequest<{ Body: createMetodoPagamentoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isMetodoPagamentoNome = await getMetodoPagamentoByNome(nome);
  if (isMetodoPagamentoNome) throwInvalidNomeError();

  const metodoPagamento = await createMetodoPagamento({ nome });
  return reply.status(HttpStatusCodes.CREATED).send(metodoPagamento);
}

export async function updateMetodoPagamentoController(
  request: FastifyRequest<{
    Params: metodoPagamentoParamsType;
    Body: createMetodoPagamentoBodyType;
  }>,
  reply: FastifyReply
) {
  const { metodoPagamentoId } = request.params;
  const { nome } = request.body;

  const [isMetodoPagamentoId, metodoPagamento] = await Promise.all([
    getMetodoPagamentoById(metodoPagamentoId),
    getMetodoPagamentoByNome(nome),
  ]);

  if (!isMetodoPagamentoId) throwNotFoundMetodoPagamentoIdError();
  if (metodoPagamento && metodoPagamento.id !== metodoPagamentoId)
    throwInvalidNomeError();

  const metodoPagamentoUpdated = await updateMetodoPagamento(
    metodoPagamentoId,
    { nome }
  );
  return reply.send(metodoPagamentoUpdated);
}

export async function getMetodoPagamentoController(
  request: FastifyRequest<{
    Params: metodoPagamentoParamsType;
  }>,
  reply: FastifyReply
) {
  const { metodoPagamentoId } = request.params;
  const metodoPagamento = await getMetodoPagamentoById(metodoPagamentoId);

  if (!metodoPagamento) throwNotFoundMetodoPagamentoIdError();
  return reply.send(metodoPagamento);
}

export async function getMetodosPagamentoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const metodosPagamento = await getMetodosPagamento();
  return reply.send(metodosPagamento);
}
