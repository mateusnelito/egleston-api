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
import { throwValidationError } from '../utils/utilsFunctions';

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

  if (!isResponsavelId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Responsavel não encontrado.'
    );

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // 'Cause nobody has 2 fathers or mothers
  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentescoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Parentesco inválido.', {
      parentescoId: ['Parentesco não encontrado.'],
    });

  if (
    responsavelTelefone &&
    responsavelTelefone.responsavelId !== responsavelId
  )
    throwValidationError(HttpStatusCodes.CONFLICT, 'Responsavel inválido.', {
      contacto: {
        telefone: ['Telefone já existe.'],
      },
    });

  if (responsavelEmail && responsavelEmail.responsavelId !== responsavelId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Responsavel inválido.', {
      contacto: {
        email: ['Email já existe.'],
      },
    });

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

  if (!isResponsavelId)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Responsavel não encontrado.'
    );

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

  if (!responsavel)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Responsavel não encontrado.'
    );

  return reply.send(responsavel);
}
