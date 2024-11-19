import { FastifyReply, FastifyRequest } from 'fastify';
import {
  anoLectivoParamsType,
  changeAnoLectivoStatusesBodyType,
  createAnoLectivoBodyType,
  createClasseToAnoLectivoBodyType,
} from '../schemas/anoLectivoSchema';
import {
  changeAnoLectivoStatus,
  createAnoLectivo,
  getAnoLectivo,
  getAnoLectivoActivo,
  getAnoLectivoByNome,
  getAnoLectivoId,
  getAnoLectivos,
  updateAnoLectivo,
} from '../services/anoLectivoServices';
import {
  createClasse,
  getClasseByUniqueKey,
  getClassesByAnoLectivo,
} from '../services/classeServices';
import { getCursoId } from '../services/cursoServices';
import { getTrimestreByAnoLectivo } from '../services/trimestreServices';
import { ANO_LECTIVO_MONTH_LENGTH } from '../utils/constants';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
  throwValidationError,
} from '../utils/utilsFunctions';

export async function createAnoLectivoController(
  request: FastifyRequest<{ Body: createAnoLectivoBodyType }>,
  reply: FastifyReply
) {
  const { inicio: inicioString, termino: terminoString } = request.body;
  const inicio = new Date(inicioString);
  const termino = new Date(terminoString);

  // Validating dates
  if (isBeginDateAfterEndDate(inicio, termino))
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Inicio inválido', {
      inicio: ['Início não pode ser após o término.'],
    });

  // FIXME: O dia de inicio do mês não começa em 01 caso for dado com 01.
  // e.g: 2024-09-01 -> 2024-08-31
  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');

  if (yearMonthLength !== ANO_LECTIVO_MONTH_LENGTH)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Termino inválido', {
      termino: ['A duração do ano lectivo deve ser de 11 meses.'],
    });

  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;
  const isAnoLectivoNome = await getAnoLectivoByNome(nome);

  if (isAnoLectivoNome)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Ano lectivo já existe.');

  const anoLectivo = await createAnoLectivo({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send({
    id: anoLectivo.id,
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
    activo: anoLectivo.activo,
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

  if (isBeginDateAfterEndDate(inicio, termino))
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Inicio inválido', {
      inicio: ['Início não pode ser após o término.'],
    });

  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');

  if (yearMonthLength !== ANO_LECTIVO_MONTH_LENGTH)
    throwValidationError(HttpStatusCodes.BAD_REQUEST, 'Termino inválido', {
      termino: ['A duração do ano lectivo deve ser de 11 meses.'],
    });

  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;
  const [isAnoLectivo, anoLectivo] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getAnoLectivoByNome(nome),
  ]);

  if (!isAnoLectivo)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Ano lectivo não encontrado.'
    );

  if (anoLectivo && anoLectivo.id !== anoLectivoId)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Ano lectivo já existe.');

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
    activo: anoLectivoUpdated.activo,
  });
}

export async function getAnoLectivosController(
  _: FastifyRequest,
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

  if (!anoLectivo)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Ano lectivo não encontrado.'
    );

  return reply.send({
    id: anoLectivo!.id,
    nome: anoLectivo!.nome,
    inicio: formatDate(anoLectivo!.inicio),
    termino: formatDate(anoLectivo!.termino),
    activo: anoLectivo!.activo,
    matriculaAberta: anoLectivo!.matriculaAberta,
  });
}

export async function getAnoLectivoClassesController(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Ano lectivo não encontrado.'
    );

  const classes = await getClassesByAnoLectivo(anoLectivoId);
  return reply.send(classes);
}

export async function createClasseToAnoLectivoController(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: createClasseToAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const { nome, ordem, cursoId, valorMatricula } = request.body;

  const [isAnoLectivo, isCursoId] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getCursoId(cursoId),
  ]);

  if (!isAnoLectivo)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Ano lectivo não encontrado.'
    );

  if (!isCursoId)
    throwValidationError(HttpStatusCodes.NOT_FOUND, 'Curso inválido.', {
      cursoId: ['Curso não encontrado'],
    });

  const isClasse = await getClasseByUniqueKey(nome, anoLectivoId, cursoId);

  if (isClasse)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Classe já existe.');

  // TODO: REFACTOR THIS
  const classe = await createClasse({
    nome,
    ordem,
    anoLectivoId,
    cursoId,
    valorMatricula: Number(valorMatricula.toFixed(2)),
  });

  // TODO: Send a appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}

export async function changeAnoLectivoStatusController(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: changeAnoLectivoStatusesBodyType;
  }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const { activo, matriculaAberta } = request.body;

  const anoLectivo = await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Ano lectivo não encontrado.'
    );

  const anoLectivoActivo = await getAnoLectivoActivo();

  if (activo && anoLectivoId !== anoLectivoActivo.id)
    throwValidationError(HttpStatusCodes.CONFLICT, 'Status activo inválido.', {
      activo: ['Apenas um ano letivo pode estar ativo no sistema de cada vez.'],
    });

  if (matriculaAberta && anoLectivoId !== anoLectivoActivo.id)
    throwValidationError(
      HttpStatusCodes.CONFLICT,
      'Status matriculaAberta inválido.',
      {
        matriculaAberta: [
          'Apenas ano letivo activo pode ter matriculas abertas',
        ],
      }
    );

  return reply.send(
    await changeAnoLectivoStatus(anoLectivoId, activo, matriculaAberta)
  );
}

export async function getAnoLectivoTrimestresController(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo)
    throwValidationError(
      HttpStatusCodes.NOT_FOUND,
      'Ano lectivo não encontrado.'
    );

  return reply.send(await getTrimestreByAnoLectivo(anoLectivoId));
}
