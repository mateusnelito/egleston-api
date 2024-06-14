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

export async function createAluno(
  // Define that the Generic Type of Body is CreateAlunoBodyType
  request: FastifyRequest<{ Body: CreateAlunoBodyType }>,
  reply: FastifyReply
) {
  const { numeroBi } = request.body;
  const aluno = await getAlunoByNumeroBi(numeroBi);

  if (aluno) {
    throw new BadRequest('Número de BI inválido.', {
      numeroBi: ['Já existe um aluno com o mesmo número de BI'],
    });
  }

  const { id } = await saveAluno(request.body);
  return reply.status(HttpStatusCodes.CREATED).send({ id });
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

export async function getAlunos(
  request: FastifyRequest<{ Querystring: getAlunosQueryStringType }>,
  reply: FastifyReply
) {
  const { page, pageSize } = request.query;

  const offset = page * pageSize;
  // return reply.send({
  //   page,
  //   offset,
  //   pageSize,
  // });

  const alunos = await getAllAlunos(offset, pageSize);

  return reply.send(alunos);
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
