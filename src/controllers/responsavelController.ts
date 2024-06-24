import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createParentescoBodyType,
  getParentescosQueryStringType,
  uniqueParentescoResourceParamsType,
  updateParentescoBodyType,
} from '../schemas/parentescoSchema';
import {
  getParentescos as getAllParentescos,
  changeParentesco,
  getParentescoById,
  getParentescoByNome,
  saveParentesco,
} from '../services/parentescoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  responsavelBodyType,
  createResponsavelParamsType,
  uniqueResponsavelResourceParamsType,
} from '../schemas/responsavelSchema';
import { getAlunoById } from '../services/alunoServices';
import { getEmail, getTelefone } from '../services/responsavelContactoServices';
import {
  changeResponsavel,
  deleteResponsavel,
  getResponsavelById,
  getResponsavelDetails,
  saveResponsavel,
} from '../services/responsavelServices';

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
    await getAlunoById(alunoId),
    await getParentescoById(parentescoId),
    await getTelefone(telefone),
  ]);

  if (!isAluno) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Id de aluno não existe.',
    });
  }

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // TODO: 'Cause nobody has 2 fathers or mothers
  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentesco) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: {
        parentescoId: ['parentescoId não existe.'],
      },
    });
  }

  if (isTelefone) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de telefone inválido.',
      errors: {
        telefone: ['O número de telefone já está sendo usado.'],
      },
    });
  }

  if (email) {
    const isEmail = await getEmail(email);
    if (isEmail) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Endereço de email inválido.',
        errors: {
          email: ['O endereço de email já está sendo usado.'],
        },
      });
    }
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
    await getResponsavelById(responsavelId),
    await getParentescoById(parentescoId),
    await getTelefone(telefone, responsavelId),
  ]);

  if (!isResponsavel) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Id de responsavel não existe.',
    });
  }

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // TODO: 'Cause nobody has 2 fathers or mothers
  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentesco) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Parentesco inválido.',
      errors: {
        parentescoId: ['parentescoId não existe.'],
      },
    });
  }

  if (isTelefone) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de telefone inválido.',
      errors: {
        telefone: ['O número de telefone já está sendo usado.'],
      },
    });
  }

  if (email) {
    const isEmail = await getEmail(email, responsavelId);
    if (isEmail) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Endereço de email inválido.',
        errors: {
          email: ['O endereço de email já está sendo usado.'],
        },
      });
    }
  }

  const responsavel = await changeResponsavel(responsavelId, request.body);
  return reply.status(HttpStatusCodes.OK).send(responsavel);
}

export async function destroyResponsavel(
  request: FastifyRequest<{
    Params: uniqueResponsavelResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { responsavelId } = request.params;
  const isResponsavel = await getResponsavelById(responsavelId);

  if (!isResponsavel) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Id de responsavel não existe.',
    });
  }

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
  const isResponsavel = await getResponsavelById(responsavelId);

  if (!isResponsavel) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Id de responsavel não existe.',
    });
  }

  const responsavel = await getResponsavelDetails(responsavelId);
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
