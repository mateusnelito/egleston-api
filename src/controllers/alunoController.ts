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
import { formatDate } from '../utils/utils';

export async function createAluno(
  // Define that the Generic Type of Body is CreateAlunoBodyType
  request: FastifyRequest<{ Body: CreateAlunoBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { responsaveis } = data;

  // Checking data integrity
  // -> Aluno
  const { numeroBi, telefone, email } = data;

  const [isNumeroBi, isTelefone] = await Promise.all([
    await getAlunoByNumeroBi(numeroBi),
    await getTelefone(telefone),
  ]);

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

  // -> Responsaveis
  for (let i = 0; i < responsaveis.length; i++) {
    const responsavel = responsaveis[i];
    const { parentescoId, telefone, email } = responsavel;

    const isParentesco = await getParentescoById(parentescoId);
    if (!isParentesco) {
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

  const aluno = await saveAluno(data);
  console.log(typeof aluno);

  return reply.status(HttpStatusCodes.CREATED).send({
    id: aluno.id,
    nomeCompleto: aluno.nomeCompleto,
    nomeCompletoPai: aluno.nomeCompletoPai,
    nomeCompletoMae: aluno.nomeCompletoMae,
    numeroBi: aluno.numeroBi,
    dataNascimento: formatDate(aluno.dataNascimento),
    genero: aluno.genero,
  });
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

  const isTelefone = await getTelefone(telefone, alunoId);
  if (isTelefone) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de telefone inválido.',
      errors: { telefone: ['O número de telefone já está sendo usado.'] },
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

  const aluno = await changeAluno(alunoId, request.body);
  return reply.send({
    nomeCompleto: aluno.nomeCompleto,
    nomeCompletoPai: aluno.nomeCompletoPai,
    nomeCompletoMae: aluno.nomeCompletoMae,
    dataNascimento: formatDate(aluno.dataNascimento),
    genero: aluno.genero,
  });
}

export async function getAlunos(
  request: FastifyRequest<{ Querystring: getAlunosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const alunos = await getAllAlunos(page_size, cursor);
  const data = alunos.map((aluno) => {
    return {
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      numeroBi: aluno.numeroBi,
      dataNascimento: formatDate(aluno.dataNascimento),
      genero: aluno.genero,
    };
  });

  // Determine the next cursor
  let next_cursor =
    alunos.length === page_size ? alunos[alunos.length - 1].id : undefined;

  return reply.send({
    data,
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
    dataNascimento: aluno?.dataNascimento.toISOString().slice(0, 10),
    genero: aluno?.genero,
    bairro: aluno?.Endereco?.bairro,
    rua: aluno?.Endereco?.rua,
    numeroCasa: aluno?.Endereco?.numeroCasa,
    telefone: aluno?.Contacto?.telefone,
    email: aluno?.Contacto?.email,
  });
}
