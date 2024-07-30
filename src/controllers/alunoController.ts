import dayjs from 'dayjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateAlunoBodyType,
  getAlunosQueryStringType,
  uniqueAlunoResourceParamsType,
  updateAlunoBodyType,
} from '../schemas/alunoSchema';
import { getEmail, getTelefone } from '../services/alunoContactoServices';
import {
  changeAluno,
  getAlunos as getAllAlunos,
  getAlunoResponsaveis as getAllResponsaveis,
  getAlunoDetails,
  getAlunoId,
  getAlunoNumeroBi,
  saveAluno,
} from '../services/alunoServices';
import { getParentescoById } from '../services/parentescoServices';
import {
  getEmail as getResponsavelEmail,
  getTelefone as getResponsavelTelefone,
} from '../services/responsavelContactoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
} from '../utils/utils';

function throwInvalidDataNascimentoError(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de nascimento inválida.',
    errors: { dataNascimento: [message] },
  });
}

function throwInvalidTelefoneError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Número de telefone inválido.',
    errors: { telefone: ['O número de telefone já está sendo usado.'] },
  });
}

function throwInvalidEmailError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Endereço de email inválido.',
    errors: { email: ['O endereço de email já está sendo usado.'] },
  });
}

function throwNotFoundAlunoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de aluno não existe.',
  });
}

const MINIMUM_AGE = 14;

export async function createAluno(
  request: FastifyRequest<{ Body: CreateAlunoBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { responsaveis } = data;

  // Checking data integrity
  // -> Aluno
  const {
    dataNascimento: DataNascimentoString,
    numeroBi,
    telefone,
    email,
  } = data;
  const dataNascimento = new Date(DataNascimentoString);

  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const age = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');
  if (age < MINIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade inferior a ${MINIMUM_AGE} anos.`);
  }

  const [isNumeroBi, isTelefone] = await Promise.all([
    await getAlunoNumeroBi(numeroBi),
    await getTelefone(telefone),
  ]);

  if (isNumeroBi) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número de BI inválido.',
      errors: { numeroBi: ['O número de BI já sendo usado.'] },
    });
  }

  if (isTelefone) throwInvalidTelefoneError();

  if (email) {
    const isEmail = await getEmail(email);
    if (isEmail) throwInvalidEmailError();
  }

  // -> Responsaveis
  for (let i = 0; i < responsaveis.length; i++) {
    const responsavel = responsaveis[i];

    const { parentescoId, telefone, email } = responsavel;
    const [isParentesco, isTelefone] = await Promise.all([
      await getParentescoById(parentescoId),
      await getResponsavelTelefone(telefone),
    ]);

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
  request: FastifyRequest<{
    Params: uniqueAlunoResourceParamsType;
    Body: updateAlunoBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const {
    dataNascimento: DataNascimentoString,
    telefone,
    email,
  } = request.body;
  const dataNascimento = new Date(DataNascimentoString);

  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const age = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');
  if (age < MINIMUM_AGE) {
    throwInvalidDataNascimentoError(`Idade inferior a ${MINIMUM_AGE} anos.`);
  }

  const [isAlunoId, isTelefone] = await Promise.all([
    await getAlunoId(alunoId),
    await getTelefone(telefone, alunoId),
  ]);

  if (!isAlunoId) throwNotFoundAlunoIdError();
  if (isTelefone) throwInvalidTelefoneError();

  if (email) {
    const isEmail = await getEmail(email, alunoId);
    if (isEmail) throwInvalidEmailError();
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

  const aluno = await getAlunoDetails(alunoId);
  if (!aluno) throwNotFoundAlunoIdError();

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

export async function getResponsaveis(
  request: FastifyRequest<{
    Params: uniqueAlunoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const isAluno = await getAlunoId(alunoId);
  if (!isAluno) throwNotFoundAlunoIdError();

  const responsaveis = await getAllResponsaveis(alunoId);
  return reply.send({ data: responsaveis });
}
