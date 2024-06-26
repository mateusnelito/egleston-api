import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getProfessoresQueryStringType,
  professorBodyType,
  uniqueProfessorResourceParamsType,
} from '../schemas/professorSchemas';
import {
  changeProfessor,
  getProfessorDetails,
  getProfessorId,
  saveProfessor,
  getProfessores as getProfessoresService,
} from '../services/professorServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import BadRequest from '../utils/BadRequest';
import { getEmail, getTelefone } from '../services/professorContactoServices';
import NotFoundRequest from '../utils/NotFoundRequest';
import { formatDate } from '../utils/utils';

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
    message: 'Id de professor não existe.',
  });
}

export async function createProfessor(
  request: FastifyRequest<{ Body: professorBodyType }>,
  reply: FastifyReply
) {
  const { telefone, email } = request.body;

  const isTelefone = await getTelefone(telefone);
  if (isTelefone) throwTelefoneBadRequest();

  if (email) {
    const isEmail = await getEmail(email);
    if (isEmail) throwEmailBadRequest();
  }

  const professor = await saveProfessor(request.body);
  return reply.status(HttpStatusCodes.CREATED).send({
    id: professor.id,
    nomeCompleto: professor.nomeCompleto,
    dataNascimento: formatDate(professor.dataNascimento),
  });
}

export async function updateProfessor(
  request: FastifyRequest<{
    Params: uniqueProfessorResourceParamsType;
    Body: professorBodyType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { telefone, email } = request.body;

  const [isProfessor, isTelefone] = await Promise.all([
    await getProfessorId(professorId),
    await getTelefone(telefone, professorId),
  ]);

  if (!isProfessor) throwNotFoundRequest();
  if (isTelefone) throwTelefoneBadRequest();

  if (email) {
    const isEmail = await getEmail(email, professorId);
    if (isEmail) throwEmailBadRequest();
  }

  const professor = await changeProfessor(professorId, request.body);
  return reply.status(HttpStatusCodes.CREATED).send({
    nomeCompleto: professor.nomeCompleto,
    dataNascimento: formatDate(professor.dataNascimento),
  });
}

export async function getProfessor(
  request: FastifyRequest<{
    Params: uniqueProfessorResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const professor = await getProfessorDetails(professorId);

  if (!professor) throw throwNotFoundRequest();

  return reply.send({
    id: professor.id,
    nomeCompleto: professor.nomeCompleto,
    dataNascimento: formatDate(professor.dataNascimento),
    contacto: {
      telefone: professor.Contacto?.telefone,
      email: professor.Contacto?.email,
      outros: professor.Contacto?.outros,
    },
  });
}

export async function getProfessores(
  request: FastifyRequest<{ Querystring: getProfessoresQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;

  const professores = await getProfessoresService(page_size, cursor);

  let next_cursor =
    professores.length === page_size
      ? professores[professores.length - 1].id
      : undefined;

  const data = professores.map((professor) => {
    return {
      id: professor.id,
      nomeCompleto: professor.nomeCompleto,
      dataNascimento: formatDate(professor.dataNascimento),
    };
  });

  return reply.send({
    data,
    next_cursor,
  });
}
