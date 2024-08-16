import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createClasseToCursoBodyType,
  createCursoBodyType,
  cursoDisciplinaAssociationBodyType,
  cursoParamsType,
  deleteCursoDisciplinaParamsType,
  updateCursoBodyType,
} from '../schemas/cursoSchema';
import { getAnoLectivo, getAnoLectivoId } from '../services/anoLectivoServices';
import {
  createClasse,
  getClasseByCompostUniqueKey,
  getClassesByCurso,
} from '../services/classeServices';
import {
  createCurso,
  getCurso,
  getCursoId,
  getCursoNome,
  getCursos,
  updateCurso,
} from '../services/cursoServices';
import {
  createMultiplesCursoDisciplinaByCurso,
  getCursoDisciplina,
  deleteCursoDisciplina,
  deleteMultiplesCursoDisciplinasByCursoId,
} from '../services/cursosDisciplinasServices';
import { getDisciplinaId } from '../services/disciplinaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import { arrayHasDuplicatedValue } from '../utils/utils';

function throwNotFoundCursoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Id de curso não existe.',
  });
}

function throwInvalidNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de curso inválido.',
    errors: { nome: ['O nome de curso já existe.'] },
  });
}

function throwInvalidDisciplinasError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Disciplinas inválidas.',
    errors: {
      disciplinas: [
        'o array de disciplinas não podem conter items duplicados.',
      ],
    },
  });
}

export async function createCursoController(
  request: FastifyRequest<{ Body: createCursoBodyType }>,
  reply: FastifyReply
) {
  const { nome, disciplinas } = request.body;

  if (disciplinas && arrayHasDuplicatedValue(disciplinas))
    throwInvalidDisciplinasError();

  const isCursoNome = await getCursoNome(nome);
  if (isCursoNome) throwInvalidNomeError();

  if (disciplinas) {
    for (let i = 0; i < disciplinas.length; i++) {
      const disciplinaId = disciplinas[i];
      const isDisciplinaId = await getDisciplinaId(disciplinaId);

      // TODO: Finish the verification before send the errors, to send all invalids disciplinas
      if (!isDisciplinaId) {
        throw new BadRequest({
          statusCode: HttpStatusCodes.NOT_FOUND,
          message: 'Disciplina inválida.',
          errors: {
            disciplinas: {
              [i]: 'ID da disciplina não existe.',
            },
          },
        });
      }
    }
  }

  const curso = await createCurso(request.body);
  return reply.status(HttpStatusCodes.CREATED).send(curso);
}

export async function updateCursoController(
  request: FastifyRequest<{
    Body: updateCursoBodyType;
    Params: cursoParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { nome } = request.body;

  const [isCursoId, curso] = await Promise.all([
    await getCursoId(cursoId),
    await getCursoNome(nome),
  ]);

  if (!isCursoId) throwNotFoundCursoIdError();
  if (curso && curso.id !== cursoId) throwInvalidNomeError();

  const cursoUpdated = await updateCurso(cursoId, request.body);
  return reply.send(cursoUpdated);
}

export async function getCursosController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const data = await getCursos();
  return reply.send({ data });
}

export async function getCursoController(
  request: FastifyRequest<{
    Params: cursoParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;

  const curso = await getCurso(cursoId);
  if (!curso) throwNotFoundCursoIdError();

  return reply.send(curso);
}

export async function createMultiplesCursoDisciplinaByCursoController(
  request: FastifyRequest<{
    Body: cursoDisciplinaAssociationBodyType;
    Params: cursoParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedValue(disciplinas)) throwInvalidDisciplinasError();

  const isCursoId = await getCursoId(cursoId);
  if (!isCursoId) throwNotFoundCursoIdError();

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const [isDisciplinaId, isCursoDisciplina] = await Promise.all([
      await getDisciplinaId(disciplinaId),
      await getCursoDisciplina(cursoId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplinaId) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'ID da disciplina não existe.',
          },
        },
      });
    }

    if (isCursoDisciplina) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'Disciplina já registrada no curso.',
          },
        },
      });
    }
  }

  const cursoDisciplinas = await createMultiplesCursoDisciplinaByCurso(
    cursoId,
    disciplinas
  );

  // TODO: Send an appropriate response
  return reply.send(cursoDisciplinas);
}

export async function deleteCursoDisciplinaController(
  request: FastifyRequest<{
    Params: deleteCursoDisciplinaParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId, disciplinaId } = request.params;
  const isCursoDisciplina = await getCursoDisciplina(cursoId, disciplinaId);

  if (!isCursoDisciplina) {
    throw new NotFoundRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Disciplina não registrada no curso.',
    });
  }
  const cursoDisciplina = await deleteCursoDisciplina(cursoId, disciplinaId);

  // TODO: SEND A BETTE RESPONSE
  return reply.send(cursoDisciplina);
}

export async function deleteMultiplesCursoDisciplinasController(
  request: FastifyRequest<{
    Body: cursoDisciplinaAssociationBodyType;
    Params: cursoParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { disciplinas } = request.body;

  if (arrayHasDuplicatedValue(disciplinas)) throwInvalidDisciplinasError();

  const isCursoId = await getCursoId(cursoId);
  if (!isCursoId) throwNotFoundCursoIdError();

  for (let i = 0; i < disciplinas.length; i++) {
    const disciplinaId = disciplinas[i];

    const isCursoDisciplina = await getCursoDisciplina(cursoId, disciplinaId);

    if (!isCursoDisciplina) {
      throw new BadRequest({
        statusCode: HttpStatusCodes.NOT_FOUND,
        message: 'Disciplina inválida.',
        errors: {
          disciplinas: {
            [i]: 'Disciplina não registrada no curso.',
          },
        },
      });
    }
  }

  const cursoDisciplinas = await deleteMultiplesCursoDisciplinasByCursoId(
    cursoId,
    disciplinas
  );

  // TODO: Send an appropriate response
  return reply.send(cursoDisciplinas);
}

// TODO: CHECK IF THIS ENDPOINT SHOULD EXIST
export async function getCursoClassesController(
  request: FastifyRequest<{
    Params: cursoParamsType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;

  const isCursoId = await getCursoId(cursoId);
  if (!isCursoId) throwNotFoundCursoIdError();

  const classes = await getClassesByCurso(cursoId);
  return reply.send(classes);
}

export async function createClasseToCursoController(
  request: FastifyRequest<{
    Params: cursoParamsType;
    Body: createClasseToCursoBodyType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { nome, anoLectivoId, valorMatricula } = request.body;

  const [isCursoId, anoLectivo] = await Promise.all([
    await getCursoId(cursoId),
    await getAnoLectivo(anoLectivoId),
  ]);

  if (!isCursoId) throwNotFoundCursoIdError();
  if (!anoLectivo) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Ano lectivo inválido',
      errors: { anoLectivoId: ['ID do ano lectivo não existe.'] },
    });
  }

  const isClasse = await getClasseByCompostUniqueKey(
    nome,
    anoLectivoId,
    cursoId
  );

  if (isClasse) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Classe já registada no curso.',
    });
  }

  // TODO: REFACTOR THIS
  const classe = await createClasse({
    nome: `${nome} - ${anoLectivo!.nome}`,
    anoLectivoId,
    cursoId,
    valorMatricula: Number(valorMatricula.toFixed(2)),
  });

  // TODO: Send a appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}
