import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createResponsavelBodyType,
  responsavelParamsType,
} from '../schemas/responsavelSchema';
import { getParentescoId } from '../services/parentescoServices';
import {
  getResponsavelEmail,
  getResponsavelTelefone,
} from '../services/responsavelContactoServices';
import {
  updateResponsavel,
  deleteResponsavel,
  getResponsavel,
  getResponsavelId,
} from '../services/responsavelServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundParentescoIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Parentesco inválido.',
    errors: { parentescoId: ['parentescoId não existe.'] },
  });
}

function throwInvalidTelefoneError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Número de telefone inválido.',
    errors: {
      contacto: { telefone: ['O número de telefone já está sendo usado.'] },
    },
  });
}

function throwInvalidEmailError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Endereço de email inválido.',
    errors: {
      contacto: { email: ['O endereço de email já está sendo usado.'] },
    },
  });
}

function throwNotFoundResponsavelId() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID de responsavel não existe.',
  });
}

export async function updateResponsavelController(
  request: FastifyRequest<{
    Params: responsavelParamsType;
    Body: createResponsavelBodyType;
  }>,
  reply: FastifyReply
) {
  const { responsavelId } = request.params;
  const { body: data } = request;
  const { parentescoId } = data;
  const { telefone, email } = data.contacto;

  const [isResponsavelId, isParentescoId, responsavelTelefone] =
    await Promise.all([
      await getResponsavelId(responsavelId),
      await getParentescoId(parentescoId),
      await getResponsavelTelefone(telefone),
    ]);

  if (!isResponsavelId) throwNotFoundResponsavelId();

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // 'Cause nobody has 2 fathers or mothers
  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentescoId) throwNotFoundParentescoIdError();

  if (
    responsavelTelefone &&
    responsavelTelefone.responsavelId !== responsavelId
  )
    throwInvalidTelefoneError();

  if (email) {
    const responsavelEmail = await getResponsavelEmail(email);
    if (responsavelEmail && responsavelEmail.responsavelId !== responsavelId)
      throwInvalidEmailError();
  }

  const responsavel = await updateResponsavel(responsavelId, data);
  return reply.send(responsavel);
}

export async function deleteResponsavelController(
  request: FastifyRequest<{
    Params: responsavelParamsType;
  }>,
  reply: FastifyReply
) {
  const { responsavelId } = request.params;

  const isResponsavelId = await getResponsavelId(responsavelId);
  if (!isResponsavelId) throwNotFoundResponsavelId();

  const responsavel = await deleteResponsavel(responsavelId);
  return reply.send(responsavel);
}

export async function getResponsavelController(
  request: FastifyRequest<{
    Params: responsavelParamsType;
  }>,
  reply: FastifyReply
) {
  const { responsavelId } = request.params;

  const responsavel = await getResponsavel(responsavelId);
  if (!responsavel) throwNotFoundResponsavelId();

  return reply.send(responsavel);
}
