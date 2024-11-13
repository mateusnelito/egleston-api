import { FastifyReply, FastifyRequest } from 'fastify';
import PdfPrinter from 'pdfmake';
import { createMatriculaBodyType } from '../schemas/matriculaSchemas';
import { createAlunoMatricula } from '../services/alunoServices';
import { validateAlunoData } from '../services/alunoValidationService';
import { getAnoLectivoActivo } from '../services/anoLectivoServices';
import { validateMatriculaData } from '../services/matriculaValidationService';
import { validateResponsavelData } from '../services/responsaveisValidationServices';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { createMatriculaPdf, pdfDefaultFonts } from '../utils/pdfUtils';
import {
  arrayHasDuplicatedItems,
  throwValidationError,
} from '../utils/utilsFunctions';

export async function createMatriculaController(
  request: FastifyRequest<{ Body: createMatriculaBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { aluno: alunoData } = data;
  const { responsaveis: alunoResponsaveis } = alunoData;
  const { classeId, turmaId, metodoPagamentoId } = request.body;

  const responsaveisTelefone = alunoResponsaveis.map(
    (responsavel) => responsavel.contacto.telefone
  );

  const responsaveisEmails = alunoResponsaveis.map(
    (responsavel) => responsavel.contacto?.email
  );

  // TODO: CHECK IF THERE'S DUPLICATED RESPONSAVEIS OBJECT, NOT ONLY DUPLICATED CONTACTS
  if (
    arrayHasDuplicatedItems(responsaveisTelefone) ||
    arrayHasDuplicatedItems(responsaveisEmails)
  )
    throwValidationError(
      HttpStatusCodes.BAD_REQUEST,
      'Responsaveis inválido.',
      {
        aluno: {
          responsaveis: ['responsaveis não podem conter contactos duplicados.'],
        },
      }
    );

  const activeAnoLectivo = await getAnoLectivoActivo();

  if (!activeAnoLectivo)
    throwValidationError(
      HttpStatusCodes.PRECONDITION_FAILED,
      'Nenhum ano lectivo activo encontrado.'
    );

  if (!activeAnoLectivo?.matriculaAberta)
    throwValidationError(HttpStatusCodes.FORBIDDEN, 'Matriculas fechadas.');

  await validateAlunoData(alunoData);

  for (let index = 0; index < alunoResponsaveis.length; index++) {
    const responsavel = alunoResponsaveis[index];
    await validateResponsavelData(responsavel, index);
  }

  await validateMatriculaData({
    classeId,
    turmaId,
    metodoPagamentoId,
  });

  const matricula = await createAlunoMatricula(activeAnoLectivo!.id, data);

  // -> Making the PDF
  const pdfPrinter = new PdfPrinter(pdfDefaultFonts);

  const matriculaPdfDocument = pdfPrinter.createPdfKitDocument(
    createMatriculaPdf(matricula)
  );

  reply.type('application/pdf');

  // Making streaming of PDF to response
  matriculaPdfDocument.pipe(reply.raw);

  // Ending PDF creation
  matriculaPdfDocument.end();

  // TODO: SET THE PDF NAME BEFORE SEND

  return reply;
}
