import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createClasseToCursoBodyType,
  createCursoBodyType,
  cursoDisciplinaAssociationBodyType,
  cursoParamsType,
  deleteCursoDisciplinaParamsType,
  getCursoClassesQueryType,
  getCursoDisciplinasQueryDataType,
  updateCursoBodyType,
} from '../schemas/cursoSchema';
import { getAnoLectivoActivo } from '../services/anoLectivoServices';
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
  getDisciplinasByCurso,
  getNoAssociatedDisciplinasByCurso,
} from '../services/cursosDisciplinasServices';
import { getDisciplinaId } from '../services/disciplinaServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  arrayHasDuplicatedItems,
  throwValidationError,
} from '../utils/utilsFunctions';

export async function createCursoController(
  request: FastifyRequest<{ Body: createCursoBodyType }>,
  reply: FastifyReply
) {
  const { nome, disciplinas } = request.body;

  if (disciplinas && arrayHasDuplicatedItems(disciplinas))
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplinas inválidas.',
      { disciplinas: ['Disciplinas devem ser únicas.'] }
    );

  const isCursoNome = await getCursoNome(nome);
  if (isCursoNome)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Curso inválido.', {
      nome: ['O nome de curso já existe.'],
    });

  // TODO: TRY TO USE PROMISE.ALL HERE
  if (disciplinas) {
    for (let index = 0; index < disciplinas.length; index++) {
      const disciplinaId = disciplinas[index];
      const isDisciplinaId = await getDisciplinaId(disciplinaId);

      // TODO: Finish the verification before send the errors, to send all invalids disciplinas
      if (!isDisciplinaId)
        throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso inválido.', {
          disciplinas: { [index]: ['Curso não encontrado.'] },
        });
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

  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  if (curso && curso.id !== cursoId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Curso inválido.', {
      nome: ['O nome de curso já existe.'],
    });

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
  if (!curso)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

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

  if (arrayHasDuplicatedItems(disciplinas))
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplinas inválidas.',
      { disciplinas: ['Disciplinas devem ser únicas.'] }
    );

  const isCursoId = await getCursoId(cursoId);
  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];

    const [isDisciplinaId, isCursoDisciplina] = await Promise.all([
      getDisciplinaId(disciplinaId),
      getCursoDisciplina(cursoId, disciplinaId),
    ]);

    // TODO: Finish the verification before send the errors, to send all invalids disciplinas
    if (!isDisciplinaId)
      throwValidationError(HttpStatusCodes.NOT_FOUND, 'Disciplina inválida.', {
        disciplinas: { [index]: ['Disciplina não encontrada.'] },
      });

    if (isCursoDisciplina)
      throwValidationError(HttpStatusCodes.CONFLICT, 'Disciplina inválida.', {
        disciplinas: { [index]: ['Disciplina já associada ao curso.'] },
      });
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

  if (!isCursoDisciplina)
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplina não associada ao curso.'
    );

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

  if (arrayHasDuplicatedItems(disciplinas))
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Disciplinas inválidas.',
      { disciplinas: ['Disciplinas devem ser únicas.'] }
    );

  const isCursoId = await getCursoId(cursoId);
  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  for (let index = 0; index < disciplinas.length; index++) {
    const disciplinaId = disciplinas[index];
    const isCursoDisciplina = await getCursoDisciplina(cursoId, disciplinaId);

    if (!isCursoDisciplina)
      throwValidationError(
        HttpStatusCodes.BAD_REQUEST,
        'Disciplina inválida.',
        { disciplinas: { [index]: ['Disciplina não associada ao curso.'] } }
      );
  }

  const cursoDisciplinas = await deleteMultiplesCursoDisciplinasByCursoId(
    cursoId,
    disciplinas
  );

  // TODO: Send an appropriate response
  return reply.send(cursoDisciplinas);
}

export async function getCursoClassesController(
  request: FastifyRequest<{
    Params: cursoParamsType;
    Querystring: getCursoClassesQueryType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { anoLectivoId } = request.query;

  const isCursoId = await getCursoId(cursoId);

  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  const classes = await getClassesByCurso(cursoId, anoLectivoId);
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
  const { nome, ordem, valorMatricula } = request.body;

  const [isCursoId, activeAnoLectivo] = await Promise.all([
    getCursoId(cursoId),
    getAnoLectivoActivo(),
  ]);

  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  if (!activeAnoLectivo)
    throwValidationError(
      HttpStatusCodes.PRECONDITION_FAILED,
      'Nenhum ano lectivo activo encontrado.'
    );

  const isClasse = await getClasseByUniqueKey(
    nome,
    activeAnoLectivo!.id,
    cursoId
  );

  if (isClasse)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Classe já existe.');

  // TODO: REFACTOR THIS
  const classe = await createClasse({
    nome,
    ordem,
    anoLectivoId: activeAnoLectivo!.id,
    cursoId,
    valorMatricula: Number(valorMatricula.toFixed(2)),
  });

  // TODO: Send a appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}

export async function getCursoDisciplinasController(
  request: FastifyRequest<{
    Params: cursoParamsType;
    Querystring: getCursoDisciplinasQueryDataType;
  }>,
  reply: FastifyReply
) {
  const { cursoId } = request.params;
  const { excluirAssociadas } = request.query;

  const isCursoId = await getCursoId(cursoId);

  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso não encontrado.');

  const disciplinas = excluirAssociadas
    ? getNoAssociatedDisciplinasByCurso(cursoId)
    : getDisciplinasByCurso(cursoId);

  return reply.send(await disciplinas);
}
