import { FastifyReply, FastifyRequest } from 'fastify';
import { professorBodyType } from '../schemas/professorSchemas';
import { saveProfessor } from '../services/professorServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import BadRequest from '../utils/BadRequest';
import { getEmail, getTelefone } from '../services/professorContactoServices';
import NotFoundRequest from '../utils/NotFoundRequest';

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
  return reply.status(HttpStatusCodes.CREATED).send(professor);
}
