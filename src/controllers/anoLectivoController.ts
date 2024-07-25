import { FastifyReply, FastifyRequest } from 'fastify';
import {
  anoLectivoParamsType,
  postAnoLectivoBodyType,
  postClasseToAnoLectivoBodyType,
} from '../schemas/anoLectivoSchema';
import {
  changeAnoLectivo,
  getAnoLectivoId,
  getAnoLectivoNome,
  recoveryAnoLectivo,
  recoveryAnoLectivos,
  saveAnoLectivo,
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

function throwInicioBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de início inválida.',
    errors: { inicio: ['Início não pode ser após o término.'] },
  });
}

function throwYearLengthBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Ano lectivo inválido',
    errors: { termino: ['A duração do ano lectivo deve ser de 11 meses.'] },
  });
}

function throwAnoLectivoAlreadyExistBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'O ano lectivo já existe.',
  });
}

function throwNotFoundRequest() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do ano lectivo não existe.',
  });
}

const YEAR_LENGTH = 11;

export async function createAnoLectivo(
  request: FastifyRequest<{ Body: postAnoLectivoBodyType }>,
  reply: FastifyReply
) {
  const { inicio: inicioString, termino: terminoString } = request.body;
  const inicio = new Date(inicioString);
  const termino = new Date(terminoString);

  // Validating dates
  if (isBeginDateAfterEndDate(inicio, termino)) throwInicioBadRequest();

  // FIXME: O dia de inicio do mês não começa em 01 caso for dado com 01.
  // FIXME: e.g: 2024-09-01 -> 2024-08-31
  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');
  if (yearMonthLength !== YEAR_LENGTH) throwYearLengthBadRequest();

  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;

  const isAnoLectivoNome = await getAnoLectivoNome(nome);
  if (isAnoLectivoNome) throwAnoLectivoAlreadyExistBadRequest();

  const anoLectivo = await saveAnoLectivo({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send({
    id: anoLectivo.id,
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
  });
}

export async function updateAnoLectivo(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: postAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { inicio: inicioString, termino: terminoString } = request.body;
  const inicio = new Date(inicioString);
  const termino = new Date(terminoString);

  // Validating dates
  if (isBeginDateAfterEndDate(inicio, termino)) throwInicioBadRequest();

  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');
  if (yearMonthLength !== YEAR_LENGTH) throwYearLengthBadRequest();

  const { anoLectivoId } = request.params;
  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;

  const [isAnoLectivo, isAnoLectivoNome] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getAnoLectivoNome(nome, anoLectivoId),
  ]);

  if (!isAnoLectivo) throwNotFoundRequest();
  if (isAnoLectivoNome) throwAnoLectivoAlreadyExistBadRequest();

  const anoLectivo = await changeAnoLectivo(anoLectivoId, {
    nome,
    inicio,
    termino,
  });
  return reply.send({
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
  });
}

export async function getAnoLectivos(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = await recoveryAnoLectivos();
  return reply.send({ data });
}

export async function getAnoLectivo(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await recoveryAnoLectivo(anoLectivoId);

  if (!anoLectivo) {
    throwNotFoundRequest();
  } else {
    return reply.send({
      id: anoLectivo.id,
      nome: anoLectivo.nome,
      inicio: formatDate(anoLectivo.inicio),
      termino: formatDate(anoLectivo.termino),
    });
  }
}

export async function getAnoLectivoClasses(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo) throwNotFoundRequest();

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

export async function addClasseToAnoLectivo(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: postClasseToAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const { nome, cursoId } = request.body;

  const [isAnoLectivo, isCurso] = await Promise.all([
    await getAnoLectivoId(anoLectivoId),
    await getCursoId(cursoId),
  ]);

  if (!isAnoLectivo) throwNotFoundRequest();
  if (!isCurso) {
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
