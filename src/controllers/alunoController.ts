import { FastifyReply, FastifyRequest } from 'fastify';
import PdfPrinter from 'pdfmake';
import {
  alunoParamsType,
  createAlunoMatriculaBodyType,
  getAlunosQueryStringType,
  updateAlunoBodyType,
} from '../schemas/alunoSchemas';
import { createResponsavelBodyType } from '../schemas/responsavelSchema';
import {
  getAlunoEmail,
  getAlunoTelefone,
} from '../services/alunoContactoServices';
import {
  getAluno,
  getAlunoId,
  getAlunoResponsaveis,
  getAlunos,
  updateAluno,
} from '../services/alunoServices';
import {
  createMatricula,
  getMatriculaByUniqueKey,
  getMatriculasByAlunoId,
} from '../services/matriculaServices';
import { validateMatriculaData } from '../services/matriculaValidationService';
import { getParentescoId } from '../services/parentescoServices';
import {
  getResponsavelEmail,
  getResponsavelTelefone,
} from '../services/responsavelContactoServices';
import {
  createResponsavel,
  getTotalAlunoResponsaveis,
} from '../services/responsavelServices';
import BadRequest from '../utils/BadRequest';
import {
  MINIMUM_ALUNO_AGE,
  MINIMUM_ALUNO_RESPONSAVEIS,
  throwNotFoundAlunoIdError,
} from '../utils/controllers/alunoControllerUtils';
import { throwNotFoundParentescoIdFieldError } from '../utils/controllers/parentescoControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { createMatriculaPdf, pdfDefaultFonts } from '../utils/pdfUtils';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
  throwDuplicatedEmailError,
  throwDuplicatedTelefoneError,
  throwInvalidDataNascimentoError,
} from '../utils/utilsFunctions';
import { getAnoLectivoByActivo } from '../services/anoLectivoServices';
import { throwActiveAnoLectivoNotFoundError } from '../utils/controllers/anoLectivoControllerUtils';
import { throwDuplicatedMatriculaError } from '../utils/controllers/matriculaControllerUtils';

export async function updateAlunoController(
  request: FastifyRequest<{
    Params: alunoParamsType;
    Body: updateAlunoBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { body: data } = request;
  const { dataNascimento } = data;
  const { telefone, email } = data.contacto;

  if (isBeginDateAfterEndDate(dataNascimento, new Date()))
    throwInvalidDataNascimentoError(
      'Data de nascimento não pôde estar no futuro.'
    );

  const alunoAge = calculateTimeBetweenDates(dataNascimento, new Date(), 'y');
  if (alunoAge < MINIMUM_ALUNO_AGE) {
    throwInvalidDataNascimentoError(
      `Idade inferior a ${MINIMUM_ALUNO_AGE} anos.`
    );
  }

  const [isAlunoId, alunoTelefone, alunoEmail] = await Promise.all([
    getAlunoId(alunoId),
    getAlunoTelefone(telefone),
    email ? getAlunoEmail(email) : null,
  ]);

  if (!isAlunoId) throwNotFoundAlunoIdError();
  if (alunoTelefone && alunoTelefone.alunoId !== alunoId)
    throwDuplicatedTelefoneError();

  if (alunoEmail && alunoEmail.alunoId !== alunoId) throwDuplicatedEmailError();

  const aluno = await updateAluno(alunoId, data);
  return reply.send(aluno);
}

export async function getAlunosController(
  request: FastifyRequest<{ Querystring: getAlunosQueryStringType }>,
  reply: FastifyReply
) {
  const { cursor, page_size } = request.query;
  const alunos = await getAlunos(page_size, cursor);

  // Determine the next cursor
  let next_cursor =
    alunos.length === page_size ? alunos[alunos.length - 1].id : undefined;

  return reply.send({
    data: alunos,
    next_cursor,
  });
}

export async function getAlunoController(
  request: FastifyRequest<{
    Params: alunoParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const aluno = await getAluno(alunoId);
  if (!aluno) throwNotFoundAlunoIdError();

  return reply.send(aluno);
}

export async function getAlunoResponsaveisController(
  request: FastifyRequest<{
    Params: alunoParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const isAlunoId = await getAlunoId(alunoId);

  if (!isAlunoId) throwNotFoundAlunoIdError();

  const responsaveis = await getAlunoResponsaveis(alunoId);
  return reply.send(responsaveis);
}

export async function createAlunoResponsavelController(
  request: FastifyRequest<{
    Params: alunoParamsType;
    Body: createResponsavelBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { body: data } = request;
  const { parentescoId } = request.body;
  const { telefone, email } = data.contacto;

  const [
    isAlunoId,
    alunoTotalResponsaveis,
    isParentescoId,
    isResponsavelTelefone,
    isResponsavelEmail,
  ] = await Promise.all([
    getAlunoId(alunoId),
    getTotalAlunoResponsaveis(alunoId),
    getParentescoId(parentescoId),
    getResponsavelTelefone(telefone),
    email ? getResponsavelEmail(email) : null,
  ]);

  if (!isAlunoId) throwNotFoundAlunoIdError();

  if (alunoTotalResponsaveis >= MINIMUM_ALUNO_RESPONSAVEIS) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Número máximo de responsaveis atingido.',
    });
  }

  // TODO: Verify if already exist a father or mother in db for the current aluno
  // 'Cause nobody has 2 fathers or mothers

  // TODO: search for better way to validate parentesco and avoid duplication
  if (!isParentescoId) throwNotFoundParentescoIdFieldError();
  if (isResponsavelTelefone) throwDuplicatedTelefoneError();
  if (isResponsavelEmail) throwDuplicatedEmailError();

  const responsavel = await createResponsavel(alunoId, request.body);
  return reply.status(HttpStatusCodes.CREATED).send(responsavel);
}

export async function getAlunoMatriculasController(
  request: FastifyRequest<{ Params: alunoParamsType }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const isAlunoId = await getAlunoId(alunoId);

  if (!isAlunoId) throwNotFoundAlunoIdError();

  const alunoMatriculas = await getMatriculasByAlunoId(alunoId);
  return reply.send(alunoMatriculas);
}

// TODO: RENAME TO OTHER NAME, TO AVOID CONFLICT
export async function createAlunoMatriculaController(
  request: FastifyRequest<{
    Params: alunoParamsType;
    Body: createAlunoMatriculaBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { classeId, cursoId, turmaId, turnoId, metodoPagamentoId } =
    request.body;
  const isAlunoId = await getAlunoId(alunoId);

  if (!isAlunoId) throwNotFoundAlunoIdError();

  await validateMatriculaData({
    classeId,
    cursoId,
    turmaId,
    turnoId,
    metodoPagamentoId,
  });

  const activeAnoLectivo = await getAnoLectivoByActivo(true);

  if (!activeAnoLectivo) throwActiveAnoLectivoNotFoundError();

  const isMatriculaId = await getMatriculaByUniqueKey(
    alunoId,
    classeId,
    activeAnoLectivo!.id
  );

  if (isMatriculaId) throwDuplicatedMatriculaError();

  const matricula = await createMatricula(
    activeAnoLectivo!.id,
    alunoId,
    request.body
  );

  // Criando o PDF
  const pdfPrinter = new PdfPrinter(pdfDefaultFonts);

  const matriculaPdfDocument = pdfPrinter.createPdfKitDocument(
    createMatriculaPdf(matricula)
  );

  reply.type('application/pdf');
  matriculaPdfDocument.pipe(reply.raw);
  matriculaPdfDocument.end();

  // TODO: SET THE FILE NAME BEFORE SEND
  return reply;
}
