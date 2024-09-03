import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createClasseToCursoBodyType,
  createCursoBodyType,
  cursoDisciplinaAssociationBodyType,
  cursoParamsType,
  deleteCursoDisciplinaParamsType,
  updateCursoBodyType,
} from '../schemas/cursoSchema';
import { getAnoLectivo } from '../services/anoLectivoServices';
import {
  createClasse,
  getClasseByUniqueKey,
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
  deleteCursoDisciplina,
  deleteMultiplesCursoDisciplinasByCursoId,
  getCursoDisciplina,
} from '../services/cursosDisciplinasServices';
import { getDisciplinaId } from '../services/disciplinaServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { throwNotFoundAnoLectivoIdFieldError } from '../utils/controllers/anoLectivoControllerUtils';
import { throwDuplicatedClasseError } from '../utils/controllers/classeControllerUtils';
import {
  throwDuplicatedCursoNomeError,
  throwNotFoundCursoIdError,
} from '../utils/controllers/cursoControllerUtils';
import {
  throwInvalidDisciplinasArrayError,
  throwNotFoundDisciplinaIdInArrayError,
} from '../utils/controllers/disciplinaControllerUtils';
import { arrayHasDuplicatedValue } from '../utils/utilsFunctions';

export async function createCursoController(
  request: FastifyRequest<{ Body: createCursoBodyType }>,
  reply: FastifyReply
) {
  const { nome, disciplinas } = request.body;

  if (disciplinas && arrayHasDuplicatedValue(disciplinas))
    throwInvalidDisciplinasArrayError();

  const isCursoNome = await getCursoNome(nome);
  if (isCursoNome) throwDuplicatedCursoNomeError();

  // TODO: TRY TO USE PROMISE.ALL HERE
  if (disciplinas) {
    for (let i = 0; i < disciplinas.length; i++) {
      const disciplinaId = disciplinas[i];
      const isDisciplinaId = await getDisciplinaId(disciplinaId);

      // TODO: Finish the verification before send the errors, to send all invalids disciplinas
      if (!isDisciplinaId)
        throwNotFoundDisciplinaIdInArrayError(i, 'Disciplina não existe.');
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
    getCursoId(cursoId),
    getCursoNome(nome),
  ]);

  if (!isCursoId) throwNotFoundCursoIdError();
  if (curso && curso.id !== cursoId) throwDuplicatedCursoNomeError();

  const cursoUpdated = await updateCurso(cursoId, request.body);
  return reply.send(cursoUpdated);
}

export async function getCursosController(
  _: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(await getCursos());
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

  if (arrayHasDuplicatedValue(disciplinas)) throwInvalidDisciplinasArrayError();

  const isCursoId = await getCursoId(cursoId);
  if (!isCursoId) throwNotFoundCursoIdError();

  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];

    const [isDisciplinaId, isCursoDisciplina] = await Promise.all([
      getDisciplinaId(disciplinaId),
      getCursoDisciplina(cursoId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplinaId)
      throwNotFoundDisciplinaIdInArrayError(index, 'Disciplina não existe.');

    if (isCursoDisciplina)
      throwNotFoundDisciplinaIdInArrayError(
        index,
        'Disciplina já registrada no curso.',
        HttpStatusCodes.BAD_REQUEST
      );
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
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Disciplina não associada ao curso.',
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

  if (arrayHasDuplicatedValue(disciplinas)) throwInvalidDisciplinasArrayError();

  const isCursoId = await getCursoId(cursoId);
  if (!isCursoId) throwNotFoundCursoIdError();

  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];
    const isCursoDisciplina = await getCursoDisciplina(cursoId, disciplinaId);

    if (!isCursoDisciplina)
      throwNotFoundDisciplinaIdInArrayError(
        index,
        'Disciplina não associada ao curso.'
      );
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
    getCursoId(cursoId),
    getAnoLectivo(anoLectivoId),
  ]);

  if (!isCursoId) throwNotFoundCursoIdError();
  if (!anoLectivo) throwNotFoundAnoLectivoIdFieldError();

  const isClasse = await getClasseByUniqueKey(nome, anoLectivoId, cursoId);

  if (isClasse) throwDuplicatedClasseError();

  // TODO: REFACTOR THIS
  const classe = await createClasse({
    nome,
    anoLectivoId,
    cursoId,
    valorMatricula: Number(valorMatricula.toFixed(2)),
  });

  // TODO: Send a appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}
