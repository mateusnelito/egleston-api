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
  deleteResponsavel,
  getResponsavel,
  getResponsavelId,
  updateResponsavel,
} from '../services/responsavelServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwNotFoundParentescoIdFieldError } from '../utils/controllers/parentescoControllerUtils';
import {
  throwDuplicatedEmailError,
  throwDuplicatedTelefoneError,
} from '../utils/utilsFunctions';
import BadRequest from '../utils/BadRequest';

function throwNotFoundResponsavelId() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Responsavel não existe.',
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

  const [
    isResponsavelId,
    isParentescoId,
    responsavelTelefone,
    responsavelEmail,
  ] = await Promise.all([
    getResponsavelId(responsavelId),
    getParentescoId(parentescoId),
    getResponsavelTelefone(telefone),
    email ? getResponsavelEmail(email) : null,
  ]);

  if (!isResponsavelId) throwNotFoundResponsavelId();

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // 'Cause nobody has 2 fathers or mothers
  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentescoId) throwNotFoundParentescoIdFieldError();

  if (
    responsavelTelefone &&
    responsavelTelefone.responsavelId !== responsavelId
  )
    throwDuplicatedTelefoneError();

  if (responsavelEmail && responsavelEmail.responsavelId !== responsavelId)
    throwDuplicatedEmailError();

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
