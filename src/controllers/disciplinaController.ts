import { FastifyReply, FastifyRequest } from 'fastify';
import {
  associateCursosWithDisciplinaBodyType,
  createDisciplinaBodyType,
  getDisciplinasQueryStringType,
  uniqueDisciplinaResourceParamsType,
  updateDisciplinaBodyType,
} from '../schemas/disciplinaSchema';
import {
  changeDisciplina,
  getDisciplinaDetails,
  getDisciplinaId,
  getDisciplinaNome,
  getDisciplinas as getDisciplinasService,
  saveDisciplina,
} from '../services/disciplinaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  checkCursoDisciplinaAssociation,
  associateCursosWithDisciplina as associateCursosWithDisciplinaService,
} from '../services/cursosDisciplinasServices';
import { getCursoId } from '../services/cursoServices';

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id da disciplina não existe.',
  });
}

function throwNomeBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome da disciplina inválido.',
    errors: { nome: ['O nome da disciplina já existe.'] },
  });
}

export async function createDisciplina(
  request: FastifyRequest<{ Body: createDisciplinaBodyType }>,
  reply: FastifyReply
) {
  const { nome } = request.body;

  const isDisciplinaNome = await getDisciplinaNome(nome);
  if (isDisciplinaNome) throwNomeBadRequest();

  const curso = await saveDisciplina(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(curso);
}

export async function updateDisciplina(
  request: FastifyRequest<{
    Params: uniqueDisciplinaResourceParamsType;
    Body: updateDisciplinaBodyType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const { nome } = request.body;

  const [isDisciplina, isDisciplinaNome] = await Promise.all([
    await getDisciplinaId(disciplinaId),
    await getDisciplinaNome(nome, disciplinaId),
  ]);

  if (!isDisciplina) throwNotFoundRequest();
  if (isDisciplinaNome) throwNomeBadRequest();

  const disciplina = await changeDisciplina(disciplinaId, request.body);
  return reply.send({
    nome: disciplina.nome,
    descricao: disciplina.descricao,
  });
}

export async function getDisciplina(
  request: FastifyRequest<{
    Params: uniqueDisciplinaResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const disciplina = await getDisciplinaDetails(disciplinaId);
  if (!disciplina) throwNotFoundRequest();
  return reply.send(disciplina);
}

export async function getDisciplinas(
  request: FastifyRequest<{
    Querystring: getDisciplinasQueryStringType;
  }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const cursos = await getDisciplinasService(page_size, cursor);

  let next_cursor =
    cursos.length === page_size ? cursos[cursos.length - 1].id : undefined;

  return reply.send({
    data: cursos,
    next_cursor,
  });
}

export async function associateDisciplinaWithCursos(
  request: FastifyRequest<{
    Body: associateCursosWithDisciplinaBodyType;
    Params: uniqueDisciplinaResourceParamsType;
  }>,
  reply: FastifyReply
) {
  const { disciplinaId } = request.params;
  const { cursos } = request.body;

  const isDisciplina = await getDisciplinaId(disciplinaId);
  if (!isDisciplina) throwNotFoundRequest();

  for (let i = 0; i < cursos.length; i++) {
    const cursoId = cursos[i];

    const [isCurso, isCursoDisciplinaAssociation] = await Promise.all([
      await getCursoId(cursoId),
      await checkCursoDisciplinaAssociation(cursoId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids cursos
    if (!isCurso) {
      // FIXME: Send the errors in simple format:
      // errors: {
      //   cursos: {
      //     [i]: 'cursoId não existe.'
      //   },
      // },

      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Curso inválido.',
        errors: {
          cursos: {
            [i]: {
              cursoId: ['cursoId não existe.'],
            },
          },
        },
      });
    }

    if (isCursoDisciplinaAssociation) {
      // FIXME: Send the errors in simple format:
      // errors: {
      //   cursos: {
      //     [i]: 'cursoId não existe.'
      //   },
      // },

      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Curso inválido.',
        errors: {
          cursos: {
            [i]: {
              cursoId: ['cursoId Já está relacionada com a disciplina.'],
            },
          },
        },
      });
    }
  }

  const cursoDisciplinas = await associateCursosWithDisciplinaService(
    disciplinaId,
    cursos
  );

  // FIXME: Send an appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(cursoDisciplinas);
}
