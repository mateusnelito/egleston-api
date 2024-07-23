import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createResponsavelParamsType,
  responsavelBodyType,
  uniqueResponsavelResourceParamsType,
} from '../schemas/responsavelSchema';
import { getAlunoId } from '../services/alunoServices';
import { getParentescoById } from '../services/parentescoServices';
import { getEmail, getTelefone } from '../services/responsavelContactoServices';
import {
  changeResponsavel,
  deleteResponsavel,
  getResponsavelDetails,
  getResponsavelId,
  saveResponsavel,
} from '../services/responsavelServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundParentesco() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Parentesco inválido.',
    errors: { parentescoId: ['parentescoId não existe.'] },
  });
}

function throwTelefoneBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Número de telefone inválido.',
    errors: { telefone: ['O número de telefone já está sendo usado.'] },
  });
}

function throwEmailBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Endereço de email inválido.',
    errors: { email: ['O endereço de email já está sendo usado.'] },
  });
}

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de responsavel não existe.',
  });
}

export async function createResponsavel(
  request: FastifyRequest<{
    Params: createResponsavelParamsType;
    Body: responsavelBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { parentescoId, telefone, email } = request.body;

  const [isAluno, isParentesco, isTelefone] = await Promise.all([
    await getAlunoId(alunoId),
    await getParentescoById(parentescoId),
    await getTelefone(telefone),
  ]);

  if (!isAluno) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Id de aluno não existe.',
    });
  }

  // TODO: Add a responsaveis limit like only 3 responsaveis for a time
  // TODO: Verify if already exist a father or mother in db for the current aluno
  // TODO: 'Cause nobody has 2 fathers or mothers
  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentesco) throwNotFoundParentesco();
  if (isTelefone) throwTelefoneBadRequest();

  if (email) {
    const isEmail = await getEmail(email);
    if (isEmail) throwEmailBadRequest();
  }

  const responsavel = await saveResponsavel(alunoId, request.body);
  return reply.status(HttpStatusCodes.CREATED).send({
    id: responsavel.id,
    nomeCompleto: responsavel.nomeCompleto,
  });
}

export async function updateResponsavel(
  request: FastifyRequest<{
    Params: uniqueResponsavelResourceParamsType;
    Body: responsavelBodyType;
  }>,
  reply: FastifyReply
) {
  const { responsavelId } = request.params;
  const { parentescoId, telefone, email } = request.body;

  const [isResponsavel, isParentesco, isTelefone] = await Promise.all([
    await getResponsavelId(responsavelId),
    await getParentescoById(parentescoId),
    await getTelefone(telefone, responsavelId),
  ]);

  if (!isResponsavel) throwNotFoundRequest();

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // TODO: 'Cause nobody has 2 fathers or mothers
  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentesco) throwNotFoundParentesco();
  if (isTelefone) throwTelefoneBadRequest();

  if (email) {
    const isEmail = await getEmail(email, responsavelId);
    if (isEmail) throwEmailBadRequest();
  }

  const responsavel = await changeResponsavel(responsavelId, request.body);
  return reply
    .status(HttpStatusCodes.OK)
    .send({ nomeCompleto: responsavel.nomeCompleto });
}

export async function destroyResponsavel(
  request: FastifyRequest<{
    Params: uniqueResponsavelResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { responsavelId } = request.params;

  const isResponsavel = await getResponsavelId(responsavelId);
  if (!isResponsavel) throwNotFoundRequest();

  const responsavel = await deleteResponsavel(responsavelId);
  return reply.send(responsavel);
}

export async function getResponsavel(
  request: FastifyRequest<{
    Params: uniqueResponsavelResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { responsavelId } = request.params;

  const responsavel = await getResponsavelDetails(responsavelId);
  if (!responsavel) throwNotFoundRequest();

  return reply.send({
    id: responsavel?.id,
    nomeCompleto: responsavel?.nomeCompleto,
    parentesco: responsavel?.Parentesco?.nome,
    endereco: {
      bairro: responsavel?.Endereco?.bairro,
      rua: responsavel?.Endereco?.rua,
      numeroCasa: responsavel?.Endereco?.numeroCasa,
    },
    contacto: {
      telefone: responsavel?.Contacto?.telefone,
      email: responsavel?.Contacto?.email,
      outros: responsavel?.Contacto?.outros,
    },
  });
}
