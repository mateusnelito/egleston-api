import { FastifyReply, FastifyRequest } from 'fastify';
import {
  anoLectivoParamsType,
  createAnoLectivoBodyType,
  createClasseToAnoLectivoBodyType,
} from '../schemas/anoLectivoSchema';
import {
  updateAnoLectivo,
  getAnoLectivoId,
  getAnoLectivoNome,
  getAnoLectivo,
  getAnoLectivos,
  createAnoLectivo,
} from '../services/anoLectivoServices';
import {
  getClasseByCompostUniqueKey,
  getClassesByAnoLectivo,
  saveClasse,
} from '../services/classeServices';
import { getCursoId } from '../services/cursoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import {
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
} from '../utils/utils';

function throwInvalidInicioError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de início inválida.',
    errors: { inicio: ['Início não pode ser após o término.'] },
  });
}

function throwInvalidYearLengthError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Ano lectivo inválido',
    errors: { termino: ['A duração do ano lectivo deve ser de 11 meses.'] },
  });
}

function throwAnoLectivoAlreadyExistError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'O ano lectivo já existe.',
  });
}

function throwNotFoundAnoLectivoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do ano lectivo não existe.',
  });
}

const YEAR_MONTH_LENGTH = 11;

export async function createAnoLectivoController(
  request: FastifyRequest<{ Body: createAnoLectivoBodyType }>,
  reply: FastifyReply
) {
  const { inicio: inicioString, termino: terminoString } = request.body;
  const inicio = new Date(inicioString);
  const termino = new Date(terminoString);

  // Validating dates
  if (isBeginDateAfterEndDate(inicio, termino)) throwInvalidInicioError();

  // FIXME: O dia de inicio do mês não começa em 01 caso for dado com 01.
  // e.g: 2024-09-01 -> 2024-08-31
  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');
  if (yearMonthLength !== YEAR_MONTH_LENGTH) throwInvalidYearLengthError();

  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;
  const isAnoLectivoNome = await getAnoLectivoNome(nome);
  if (isAnoLectivoNome) throwAnoLectivoAlreadyExistError();

  const anoLectivo = await createAnoLectivo({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send({
    id: anoLectivo.id,
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
  });
}

export async function updateAnoLectivoController(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: createAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { inicio: inicioString, termino: terminoString } = request.body;
  const { anoLectivoId } = request.params;
  const inicio = new Date(inicioString);
  const termino = new Date(terminoString);

  // Validating dates
  if (isBeginDateAfterEndDate(inicio, termino)) throwInvalidInicioError();

  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');
  if (yearMonthLength !== YEAR_MONTH_LENGTH) throwInvalidYearLengthError();

  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;
  const [isAnoLectivo, anoLectivo] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getAnoLectivoNome(nome),
  ]);

  if (!isAnoLectivo) throwNotFoundAnoLectivoIdError();
  if (anoLectivo && anoLectivo.id !== anoLectivoId)
    throwAnoLectivoAlreadyExistError();

  const anoLectivoUpdated = await updateAnoLectivo(anoLectivoId, {
    nome,
    inicio,
    termino,
  });

  return reply.send({
    id: anoLectivoUpdated.id,
    nome: anoLectivoUpdated.nome,
    inicio: formatDate(anoLectivoUpdated.inicio),
    termino: formatDate(anoLectivoUpdated.termino),
  });
}

export async function getAnoLectivosController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(await getAnoLectivos());
}

export async function getAnoLectivoController(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivo(anoLectivoId);

  if (!anoLectivo) {
    throwNotFoundAnoLectivoIdError();
  } else {
    return reply.send({
      id: anoLectivo.id,
      nome: anoLectivo.nome,
      inicio: formatDate(anoLectivo.inicio),
      termino: formatDate(anoLectivo.termino),
    });
  }
}

export async function getAnoLectivoClassesController(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo) throwNotFoundAnoLectivoIdError();

  const classes = await getClassesByAnoLectivo(anoLectivoId);
  const data = classes.map((classe) => {
    return {
      id: classe.id,
      nome: classe.nome,
      curso: classe.Curso.nome,
    };
  });

  return reply.send({ data });
}

export async function createClasseToAnoLectivoController(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: createClasseToAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const { nome, cursoId } = request.body;

  const [isAnoLectivoId, isCursoId] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivoId) throwNotFoundAnoLectivoIdError();
  if (!isCursoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Curso inválido',
      errors: { cursoId: ['ID do curso não existe.'] },
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
      message: 'Classe já registada no ano lectivo.',
    });
  }

  const classe = await saveClasse({
    nome,
    anoLectivoId,
    cursoId,
  });
  // TODO: Send a appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}
