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
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwValidationError } from '../utils/utilsFunctions';

export async function createMetodoPagamentoController(
  request: FastifyRequest<{ Body: createMetodoPagamentoBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isMetodoPagamentoNome = await getMetodoPagamentoByNome(nome);
  if (isMetodoPagamentoNome)
    throwValidationError(
      HttpStatusCodes.CONFLICT,
      'Metodo de pagamento inválido.',
      { nome: ['Nome de metodo de pagamento já existe.'] }
    );

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

  if (!isMetodoPagamentoId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Metodo de pagamento não encontrado.'
    );

  if (metodoPagamento && metodoPagamento.id !== metodoPagamentoId)
    throwValidationError(
      HttpStatusCodes.CONFLICT,
      'Metodo de pagamento inválido.',
      { nome: ['nome de metodo de pagamento já existe.'] }
    );

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

  if (!metodoPagamento)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Metodo de pagamento não encontrado.'
    );
  return reply.send(metodoPagamento);
}

export async function getMetodosPagamentoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const metodosPagamento = await getMetodosPagamento();
  return reply.send(metodosPagamento);
}
