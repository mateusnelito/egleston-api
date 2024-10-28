import { FastifyReply, FastifyRequest } from 'fastify';
import PdfPrinter from 'pdfmake';
import {
  alunoParamsType,
  createMatriculaToAlunoBodyType,
  getAlunoNotasQueryStringType,
  getAlunosQueryStringType,
  updateAlunoBodyType,
  updateAlunoNotaBodyType,
} from '../schemas/alunoSchemas';
import { createResponsavelBodyType } from '../schemas/responsavelSchema';
import {
  getAlunoEmail,
  getAlunoTelefone,
} from '../services/alunoContactoServices';
import {
  getActualAlunoClasse,
  getAluno,
  getAlunoClasses,
  getAlunoId,
  getAlunoResponsaveis,
  getAlunos,
  updateAluno,
} from '../services/alunoServices';
import { getAnoLectivoActivo } from '../services/anoLectivoServices';
import { getClasseCursoWithOrdem } from '../services/classeServices';
import {
  confirmAlunoMatricula,
  getMatriculaByUniqueKey,
  getMatriculasByAlunoId,
} from '../services/matriculaServices';
import { getMetodoPagamentoById } from '../services/metodoPagamentoServices';
import {
  getAlunoNotas,
  getNotaById,
  updateNota,
  validateNotaData,
} from '../services/notaServices';
import { getParentescoId } from '../services/parentescoServices';
import {
  getResponsavelEmail,
  getResponsavelTelefone,
} from '../services/responsavelContactoServices';
import {
  createResponsavel,
  getTotalAlunoResponsaveis,
} from '../services/responsavelServices';
import { getTurmaId, isTurmaInClasse } from '../services/turmaServices';
import BadRequest from '../utils/BadRequest';
import {
  MINIMUM_ALUNO_AGE,
  MINIMUM_ALUNO_RESPONSAVEIS,
  throwNotFoundAlunoIdError,
} from '../utils/controllers/alunoControllerUtils';
import {
  throwActiveAnoLectivoNotFoundError,
  throwMatriculaClosedForAnoLectivo,
} from '../utils/controllers/anoLectivoControllerUtils';
import {
  throwInvalidNextClasseError,
  throwNotFoundClasseIdFieldError,
  throwNotFoundPreviousClasseError,
} from '../utils/controllers/classeControllerUtils';
import { throwDuplicatedMatriculaError } from '../utils/controllers/matriculaControllerUtils';
import { throwNotFoundMetodoPagamentoIdFieldError } from '../utils/controllers/metodoPagamentoControllerUtils';
import { throwNotFoundNotaIdError } from '../utils/controllers/notaControllerUtil';
import { throwNotFoundParentescoIdFieldError } from '../utils/controllers/parentescoControllerUtils';
import { throwNotFoundTurmaIdFieldError } from '../utils/controllers/turmaControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { createMatriculaPdf, pdfDefaultFonts } from '../utils/pdfUtils';
import {
  calculateTimeBetweenDates,
  isBeginDateAfterEndDate,
  throwDuplicatedEmailError,
  throwDuplicatedTelefoneError,
  throwInvalidDataNascimentoError,
} from '../utils/utilsFunctions';

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
  const { cursor, pageSize } = request.query;
  const alunos = await getAlunos(pageSize, cursor);

  // Determine the next cursor
  let next_cursor =
    alunos.length === pageSize ? alunos[alunos.length - 1].id : undefined;

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

// TODO: REFATORAR E COMENTAR ESSE CONTROLLER
export async function confirmAlunoMatriculaController(
  request: FastifyRequest<{
    Params: alunoParamsType;
    Body: createMatriculaToAlunoBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { classeId, turmaId, metodoPagamentoId } = request.body;

  const [aluno, anoLectivo] = await Promise.all([
    getAlunoId(alunoId),
    getAnoLectivoActivo(),
  ]);

  if (!aluno) throwNotFoundAlunoIdError();
  if (!anoLectivo) throwActiveAnoLectivoNotFoundError();
  if (!anoLectivo!.matriculaAberta) throwMatriculaClosedForAnoLectivo();

  const [nextClasse, metodoPagamento] = await Promise.all([
    getClasseCursoWithOrdem(classeId),
    getMetodoPagamentoById(metodoPagamentoId),
  ]);

  if (!nextClasse) throwNotFoundClasseIdFieldError();
  if (!metodoPagamento) throwNotFoundMetodoPagamentoIdFieldError();

  const [turma, uniqueSavedMatricula] = await Promise.all([
    isTurmaInClasse(turmaId, classeId),
    getMatriculaByUniqueKey(alunoId, classeId, anoLectivo!.id),
  ]);

  if (uniqueSavedMatricula) throwDuplicatedMatriculaError();
  if (!turma)
    throwNotFoundTurmaIdFieldError(
      'Turma não associada a classe',
      HttpStatusCodes.BAD_REQUEST
    );

  const {
    Curso: { id: nextClasseCursoId },
  } = nextClasse!;

  const previousClasse = await getActualAlunoClasse(alunoId);

  if (!previousClasse) throwNotFoundPreviousClasseError();

  // Check if next classe are in the same curso and if is a sequency of previous classe
  if (
    nextClasseCursoId !== previousClasse!.curso.id ||
    ++previousClasse!.ordem !== nextClasse!.ordem
  )
    throwInvalidNextClasseError();

  const matricula = await confirmAlunoMatricula(
    anoLectivo!.id,
    alunoId,
    nextClasseCursoId,
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

export async function updateAlunoNotaController(
  request: FastifyRequest<{
    Params: alunoParamsType;
    Body: updateAlunoNotaBodyType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { classeId, disciplinaId, trimestreId, nota } = request.body;
  const isAlunoId = await getAlunoId(alunoId);

  if (!isAlunoId) throwNotFoundAlunoIdError();

  await validateNotaData({ classeId, disciplinaId, trimestreId });

  const storedNota = await getNotaById({
    alunoId,
    classeId,
    disciplinaId,
    trimestreId,
  });

  if (!storedNota) throwNotFoundNotaIdError();

  const newNota = await updateNota({
    alunoId,
    classeId,
    disciplinaId,
    trimestreId,
    nota,
  });

  return reply.send(newNota);
}

export async function getAlunoNotasController(
  request: FastifyRequest<{
    Params: alunoParamsType;
    Querystring: getAlunoNotasQueryStringType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;
  const { query } = request;

  const aluno = await getAlunoId(alunoId);

  if (!aluno) throwNotFoundAlunoIdError();

  return reply.send(await getAlunoNotas(alunoId, query));
}

export async function getAlunoClassesController(
  request: FastifyRequest<{
    Params: alunoParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const aluno = await getAlunoId(alunoId);

  if (!aluno) throwNotFoundAlunoIdError();

  const classes = await getAlunoClasses(alunoId);
  return reply.send(classes);
}

export async function getActualAlunoClasseController(
  request: FastifyRequest<{
    Params: alunoParamsType;
  }>,
  reply: FastifyReply
) {
  const { alunoId } = request.params;

  const aluno = await getAlunoId(alunoId);

  if (!aluno) throwNotFoundAlunoIdError();

  const classe = await getActualAlunoClasse(alunoId);
  return reply.send(classe);
}
