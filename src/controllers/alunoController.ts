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

export async function createAluno(
  // Define that the Generic Type of Body is CreateAlunoBodyType
  request: FastifyRequest<{ Body: CreateAlunoBodyType }>,
  reply: FastifyReply
) {
  const { numeroBi, telefone, email } = request.body;
  const isNumeroBi = await getAlunoByNumeroBi(numeroBi);

  if (isNumeroBi) {
    throw new BadRequest('Número de BI inválido.', {
      numeroBi: ['O número de BI já sendo usado.'],
    });
  }

  const [isTelefone, isEmail] = await Promise.all([
    await getTelefone(telefone),
    await getEmail(email),
  ]);

  if (isTelefone) {
    throw new BadRequest('Número de telefone inválido.', {
      numeroBi: ['O número de telefone já está sendo usado.'],
    });
  }

  if (isEmail) {
    throw new BadRequest('Email inválido.', {
      numeroBi: ['O endereço de email já sendo usado.'],
    });
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

  if (!(await getAlunoById(alunoId))) {
    throw new NotFoundRequest('Id de aluno não existe.');
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

// Determine the next cursor
export async function getAlunos(
  request: FastifyRequest<{ Querystring: getAlunosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;

  const alunos = await getAllAlunos(page_size, cursor);

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

  if (!(await getAlunoById(alunoId))) {
    throw new NotFoundRequest('Id de aluno não existe.');
  }

  const aluno = await getAlunoById(alunoId);
  return reply.send(aluno);
}
