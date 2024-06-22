import { FastifyReply, FastifyRequest } from 'fastify';
import {
  changeAluno,
  getAlunoById,
  getAlunoByNumeroBi,
  saveAluno,
  getAlunos as getAllAlunos,
} from '../services/alunoServices';
import {
  CreateAlunoBodyType,
  getAlunosQueryStringType,
  updateAlunoBodyType,
  uniqueAlunoResourceParamsType,
} from '../schemas/alunoSchema';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import BadRequest from '../utils/BadRequest';
import NotFoundRequest from '../utils/NotFoundRequest';
import { getEmail, getTelefone } from '../services/alunoContactoServices';
import { getParentescoById } from '../services/parentescoServices';
import {
  getTelefone as getResponsavelTelefone,
  getEmail as getResponsavelEmail,
} from '../services/responsavelContactoServices';

export async function createAluno(
  // Define that the Generic Type of Body is CreateAlunoBodyType
  request: FastifyRequest<{ Body: CreateAlunoBodyType }>,
  reply: FastifyReply
) {
  const { body } = request;
  const { responsaveis } = body;

  // Checking data integrity
  // -> Aluno
  const { numeroBi, telefone, email } = body;

  const [isNumeroBi, isTelefone] = await Promise.all([
    await getAlunoByNumeroBi(numeroBi),
    await getTelefone(telefone),
  ]);

  if (email) {
    const isEmail = await getEmail(email);
    if (isEmail) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Endereço de email inválido.',
        errors: { email: ['O endereço de email já está sendo usado.'] },
      });
    }
  }

  if (isNumeroBi) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de BI inválido.',
      errors: { numeroBi: ['O número de BI já sendo usado.'] },
    });
  }

  if (isTelefone) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de telefone inválido.',
      errors: { telefone: ['O número de telefone já está sendo usado.'] },
    });
  }

  // -> Responsaveis
  for (let i = 0; i < responsaveis.length; i++) {
    const responsavel = responsaveis[i];
    const { parentescoId, telefone, email } = responsavel;

    const isParentescoId = await getParentescoById(parentescoId);
    if (!isParentescoId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Parentesco inválido.',
        errors: {
          responsaveis: {
            [i]: {
              parentescoId: ['parentescoId não existe.'],
            },
          },
        },
      });
    }

    const isTelefone = await getResponsavelTelefone(telefone);
    if (isTelefone) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Número de telefone inválido.',
        errors: {
          responsaveis: {
            [i]: {
              telefone: ['O número de telefone já está sendo usado.'],
            },
          },
        },
      });
    }

    if (email) {
      const isEmail = await getResponsavelEmail(email);
      if (isEmail) {
        throw new BadRequest({
          statusCode: HttpStatusCodes.BAD_REQUEST,
          message: 'Endereço de email inválido.',
          errors: {
            responsaveis: {
              [i]: {
                email: ['O endereço de email já está sendo usado.'],
              },
            },
          },
        });
      }
    }
  }

  const aluno = await saveAluno(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(aluno);
}

export async function updateAluno(
  // Define that the Generic Type of Body is CreateAlunoBodyType and Params is updateAlunoParamsType
  request: FastifyRequest<{
    Params: uniqueAlunoResourceParamsType;
    Body: updateAlunoBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { telefone, email } = request.body;
  const isAluno = await getAlunoById(alunoId);

  if (!isAluno) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Id de aluno não existe.',
    });
  }

  if (email) {
    const isEmail = await getEmail(email, alunoId);
    if (isEmail) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Endereço de email inválido.',
        errors: { email: ['O endereço de email já está sendo usado.'] },
      });
    }
  }
  const isTelefone = await getTelefone(telefone, alunoId);
  if (isTelefone) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de telefone inválido.',
      errors: { telefone: ['O número de telefone já está sendo usado.'] },
    });
  }

  const aluno = await changeAluno(alunoId, request.body);
  return reply.send({
    nomeCompleto: aluno.nomeCompleto,
    nomeCompletoPai: aluno.nomeCompletoPai,
    nomeCompletoMae: aluno.nomeCompletoMae,
    dataNascimento: aluno.dataNascimento,
    genero: aluno.genero,
  });
}

export async function getAlunos(
  request: FastifyRequest<{ Querystring: getAlunosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;

  const alunos = await getAllAlunos(page_size, cursor);

  // Determine the next cursor
  let next_cursor =
    alunos.length === page_size ? alunos[alunos.length - 1].id : undefined;

  return reply.send({
    data: alunos,
    next_cursor,
  });
}

export async function getAluno(
  request: FastifyRequest<{
    Params: uniqueAlunoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const isAluno = await getAlunoById(alunoId);
  if (!isAluno) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Id de aluno não existe.',
    });
  }

  const aluno = await getAlunoById(alunoId);
  return reply.send({
    id: aluno?.id,
    nomeCompleto: aluno?.nomeCompleto,
    nomeCompletoPai: aluno?.nomeCompletoPai,
    nomeCompletoMae: aluno?.nomeCompletoMae,
    numeroBi: aluno?.numeroBi,
    dataNascimento: aluno?.dataNascimento,
    genero: aluno?.genero,
    bairro: aluno?.Endereco?.bairro,
    rua: aluno?.Endereco?.rua,
    numeroCasa: aluno?.Endereco?.numeroCasa,
    telefone: aluno?.Contacto?.telefone,
    email: aluno?.Contacto?.email,
  });
}
