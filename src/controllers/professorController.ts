import { FastifyReply, FastifyRequest } from 'fastify';
import {
  deleteProfessorDisciplinaAssociationParamsType,
  getProfessoresQueryStringType,
  professorBodyType,
  professorDisciplinasAssociationBodyType,
  uniqueProfessorResourceParamsType,
} from '../schemas/professorSchemas';
import { getEmail, getTelefone } from '../services/professorContactoServices';
import {
  changeProfessor,
  getProfessorDetails,
  getProfessorId,
  getProfessores as getProfessoresService,
  saveProfessor,
} from '../services/professorServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import { formatDate } from '../utils/utils';
import { getDisciplinaId } from '../services/disciplinaServices';
import {
  associateDisciplinasWithProfessor,
  checkDisciplinaProfessorAssociation,
  deleteDisciplinaProfessor,
  deleteDisciplinasWithProfessorAssociation,
} from '../services/disciplinasProfessoresServices';

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
  const { telefone, email, disciplinas } = request.body;

  const isTelefone = await getTelefone(telefone);
  if (isTelefone) throwTelefoneBadRequest();

  if (email) {
    const isEmail = await getEmail(email);
    if (isEmail) throwEmailBadRequest();
  }

  if (disciplinas) {
    for (let i = 0; i < disciplinas.length; i++) {
      const disciplina = disciplinas[i];
      const isDisciplina = await getDisciplinaId(disciplina);

      // TODO: Finish the verification before send the errors, to send all invalids disciplinas
      if (!isDisciplina) {
        // FIXME: Send the errors in simple format:
        // errors: {
        //   disciplinas: {
        //     [i]: 'disciplinaId não existe.'
        //   },
        // },

        throw new BadRequest({
          statusCode: HttpStatusCodes.NOT_FOUND,
          message: 'Disciplina inválida.',
          errors: {
            disciplinas: {
              [i]: {
                disciplinaId: ['disciplinaId não existe.'],
              },
            },
          },
        });
      }
    }
  }

  const professor = await saveProfessor(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(professor);
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

export async function associateProfessorWithDisciplinas(
  request: FastifyRequest<{
    Body: professorDisciplinasAssociationBodyType;
    Params: uniqueProfessorResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  const isProfessor = await getProfessorId(professorId);
  if (!isProfessor) throwNotFoundRequest();

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const [isDisciplina, isDisciplinaProfessorAssociation] = await Promise.all([
      await getDisciplinaId(disciplinaId),
      await checkDisciplinaProfessorAssociation(professorId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplina) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'disciplinaId não existe.',
          },
        },
      });
    }

    if (isDisciplinaProfessorAssociation) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'disciplinaId Já está relacionada com o professor.',
          },
        },
      });
    }
  }

  const cursoDisciplinas = await associateDisciplinasWithProfessor(
    professorId,
    disciplinas
  );

  // FIXME: Send an appropriate response
  return reply.send(cursoDisciplinas);
}

export async function destroyProfessorDisciplina(
  request: FastifyRequest<{
    Params: deleteProfessorDisciplinaAssociationParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId, disciplinaId } = request.params;
  const isProfessorDisciplinaRelation =
    await checkDisciplinaProfessorAssociation(professorId, disciplinaId);

  if (!isProfessorDisciplinaRelation) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Associação não existe.',
    });
  }

  const professorDisciplina = await deleteDisciplinaProfessor(
    professorId,
    disciplinaId
  );
  return reply.send(professorDisciplina);
}

export async function deleteProfessorWithDisciplinasAssociation(
  request: FastifyRequest<{
    Body: professorDisciplinasAssociationBodyType;
    Params: uniqueProfessorResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { professorId } = request.params;
  const { disciplinas } = request.body;

  const isProfessor = await getProfessorId(professorId);
  if (!isProfessor) throwNotFoundRequest();

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const isProfessorDisciplinaAssociation =
      await checkDisciplinaProfessorAssociation(professorId, disciplinaId);

    if (!isProfessorDisciplinaAssociation) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            // TODO: SEND A APPROPRIATED MESSAGE
            [i]: 'Não existe relação.',
          },
        },
      });
    }
  }

  const professorDisciplinas = await deleteDisciplinasWithProfessorAssociation(
    professorId,
    disciplinas
  );

  // FIXME: Send an appropriate response
  return reply.send(professorDisciplinas);
}
