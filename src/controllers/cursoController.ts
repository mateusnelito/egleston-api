import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCursoBodyType,
  cursoDisciplinasAssociationBodyType,
  deleteCursoDisciplinaAssociationParamsType,
  getCursosQueryStringType,
  uniqueCursoResourceParamsType,
  updateCursoBodyType,
} from '../schemas/cursoSchema';
import {
  changeCurso,
  getCursoDetails,
  getCursoId,
  getCursoNome,
  getCursos as getCursosService,
  saveCurso,
} from '../services/cursoServices';
import {
  associateDisciplinasWithCurso,
  checkCursoDisciplinaAssociation,
  deleteCursoDisciplina,
  deleteDisciplinasWithCursoAssociation,
} from '../services/cursosDisciplinasServices';
import { getDisciplinaId } from '../services/disciplinaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de curso não existe.',
  });
}

function throwNomeBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de curso inválido.',
    errors: { nome: ['O nome de curso já existe.'] },
  });
}

export async function createCurso(
  request: FastifyRequest<{ Body: createCursoBodyType }>,
  reply: FastifyReply
) {
  const { nome, disciplinas } = request.body;

  const isCursoNome = await getCursoNome(nome);
  if (isCursoNome) throwNomeBadRequest();

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

  const curso = await saveCurso(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(curso);
}

export async function updateCurso(
  request: FastifyRequest<{
    Body: updateCursoBodyType;
    Params: uniqueCursoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { nome } = request.body;

  const [isCurso, isCursoNome] = await Promise.all([
    await getCursoId(cursoId),
    await getCursoNome(nome, cursoId),
  ]);

  if (!isCurso) throwNotFoundRequest();
  if (isCursoNome) throwNomeBadRequest();

  const curso = await changeCurso(cursoId, request.body);
  return reply.send({
    nome: curso.nome,
    descricao: curso.descricao,
    duracao: curso.duracao,
  });
}

export async function getCursos(
  request: FastifyRequest<{ Querystring: getCursosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const cursos = await getCursosService(page_size, cursor);

  let next_cursor =
    cursos.length === page_size ? cursos[cursos.length - 1].id : undefined;

  return reply.send({
    data: cursos,
    next_cursor,
  });
}

export async function getCurso(
  request: FastifyRequest<{
    Params: uniqueCursoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;

  const curso = await getCursoDetails(cursoId);
  if (!curso) throwNotFoundRequest();

  return reply.send(curso);
}

export async function associateCursoWithDisciplinas(
  request: FastifyRequest<{
    Body: cursoDisciplinasAssociationBodyType;
    Params: uniqueCursoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { disciplinas } = request.body;

  const isCurso = await getCursoId(cursoId);
  if (!isCurso) throwNotFoundRequest();

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const [isDisciplinaId, isCursoDisciplinaAssociation] = await Promise.all([
      await getDisciplinaId(disciplinaId),
      await checkCursoDisciplinaAssociation(cursoId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplinaId) {
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

    if (isCursoDisciplinaAssociation) {
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
              disciplinaId: ['disciplinaId Já está relacionada com o curso.'],
            },
          },
        },
      });
    }
  }

  const cursoDisciplinas = await associateDisciplinasWithCurso(
    cursoId,
    disciplinas
  );

  // FIXME: Send an appropriate response
  return reply.send(cursoDisciplinas);
}

export async function destroyCursoDisciplina(
  request: FastifyRequest<{
    Params: deleteCursoDisciplinaAssociationParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId, disciplinaId } = request.params;
  const isCursoDisciplinaRelation = await checkCursoDisciplinaAssociation(
    cursoId,
    disciplinaId
  );

  if (!isCursoDisciplinaRelation) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Associação não existe.',
    });
  }
  const cursoDisciplina = await deleteCursoDisciplina(cursoId, disciplinaId);
  return reply.send(cursoDisciplina);
}

export async function deleteCursoWithDisciplinasAssociation(
  request: FastifyRequest<{
    Body: cursoDisciplinasAssociationBodyType;
    Params: uniqueCursoResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { disciplinas } = request.body;

  const isCurso = await getCursoId(cursoId);
  if (!isCurso) throwNotFoundRequest();

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const isCursoDisciplinaAssociation = await checkCursoDisciplinaAssociation(
      cursoId,
      disciplinaId
    );

    if (!isCursoDisciplinaAssociation) {
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
              disciplinaId: ['Não existe relação.'],
            },
          },
        },
      });
    }
  }

  const cursoDisciplinas = await deleteDisciplinasWithCursoAssociation(
    cursoId,
    disciplinas
  );

  // FIXME: Send an appropriate response
  return reply.send(cursoDisciplinas);
}
