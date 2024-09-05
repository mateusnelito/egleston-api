import { FastifyReply, FastifyRequest } from 'fastify';
import PdfPrinter from 'pdfmake';
import { createAlunoMatriculaBodyType } from '../schemas/matriculaSchemas';
import { createAlunoMatricula } from '../services/alunoServices';
import { validateAlunoData } from '../services/alunoValidationService';
import { validateMatriculaData } from '../services/matriculaValidationService';
import { validateResponsavelData } from '../services/responsaveisValidationServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { createMatriculaPdf, pdfDefaultFonts } from '../utils/pdfUtils';
import { arrayHasDuplicatedValue } from '../utils/utilsFunctions';
import { getAnoLectivoByActivo } from '../services/anoLectivoServices';
import { throwActiveAnoLectivoNotFoundError } from '../utils/controllers/anoLectivoControllerUtils';

export async function createAlunoMatriculaController(
  request: FastifyRequest<{ Body: createAlunoMatriculaBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { aluno: alunoData } = data;
  const { responsaveis: alunoResponsaveis } = alunoData;
  const { classeId, cursoId, turmaId, turnoId, metodoPagamentoId } =
    request.body;

  const responsaveisTelefone = alunoResponsaveis.map(
    (responsavel) => responsavel.contacto.telefone
  );

  const responsaveisEmails = alunoResponsaveis.map(
    (responsavel) => responsavel.contacto?.email
  );

  // TODO: CHECK IF THERE'S DUPLICATED RESPONSAVEIS OBJECT, NOT ONLY DUPLICATED CONTACTS
  if (
    arrayHasDuplicatedValue(responsaveisTelefone) ||
    arrayHasDuplicatedValue(responsaveisEmails)
  ) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Responsaveis inválidos.',
      errors: {
        aluno: {
          responsaveis: ['responsaveis não podem conter contactos duplicados.'],
        },
      },
    });
  }

  await validateAlunoData(alunoData);

  for (let index = 0; index < alunoResponsaveis.length; index++) {
    const responsavel = alunoResponsaveis[index];
    await validateResponsavelData(responsavel, index);
  }

  await validateMatriculaData({
    classeId,
    cursoId,
    turmaId,
    turnoId,
    metodoPagamentoId,
  });

  const activeAnoLectivo = await getAnoLectivoByActivo(true);

  if (!activeAnoLectivo) throwActiveAnoLectivoNotFoundError();

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

// -> WORKING...
// export async function updateMatriculaController(
//   request: FastifyRequest<{
//     Params: matriculaParamsType;
//     Body: updateMatriculaBodyType;
//   }>,
//   reply: FastifyReply
// ) {
//   const { matriculaId } = request.params;
//   const { classeId, cursoId, turmaId, metodoPagamentoId } = request.body;

//   const [isMatriculaId, isCursoId, isTurmaId, isMetodoPagamentoId] =
//     await Promise.all([
//       getMatriculaIdById(matriculaId),
//       getClasseId(classeId),
//       getCursoId(cursoId),
//       getTurmaId(turmaId),
//       getMetodoPagamentoById(metodoPagamentoId),
//     ]);

//   if (!isCursoId) throwNotFoundCursoIdFieldError();
//   if (!isTurmaId) throwNotFoundTurmaIdFieldError();

//   if (!isMetodoPagamentoId) {
//     throw new BadRequest({
//       statusCode: HttpStatusCodes.BAD_REQUEST,
//       message: 'Metodo de pagamento inválido.',
//       errors: {
//         metodoPagamentoId: ['ID metodo de pagamento não existe.'],
//       },
//     });
//   }
// }
