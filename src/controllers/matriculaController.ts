import { FastifyReply, FastifyRequest } from 'fastify';
import PdfPrinter from 'pdfmake';
import { createAlunoAndMatriculaBodyType } from '../schemas/matriculaSchemas';
import { createAlunoAndMatricula } from '../services/alunoServices';
import { validateAlunoData } from '../services/alunoValidationService';
import { validateMatriculaData } from '../services/matriculaValidationService';
import { validateResponsavelData } from '../services/responsaveisValidationServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { createMatriculaPdf, pdfDefaultFonts } from '../utils/pdfUtils';
import { arrayHasDuplicatedValue } from '../utils/utils';

export async function createAlunoAndMatriculaController(
  request: FastifyRequest<{ Body: createAlunoAndMatriculaBodyType }>,
  reply: FastifyReply
) {
  const { body: data } = request;
  const { aluno: alunoData } = data;
  const { responsaveis: alunoResponsaveis } = alunoData;

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

  const { classeId, cursoId, turmaId, anoLectivoId, metodoPagamentoId } =
    request.body;

  await validateMatriculaData({
    classeId,
    cursoId,
    turmaId,
    anoLectivoId,
    metodoPagamentoId,
  });

  const matricula = await createAlunoAndMatricula(data);

  // Criando o PDF

  // Criando uma instância do PdfPrinter
  const pdfPrinter = new PdfPrinter(pdfDefaultFonts);

  // Gerando o documento PDF
  const matriculaPdfDocument = pdfPrinter.createPdfKitDocument(
    createMatriculaPdf(matricula)
  );

  // Definindo o tipo de resposta HTTP como PDF
  reply.type('application/pdf');

  // Fazendo streaming do PDF para a resposta
  matriculaPdfDocument.pipe(reply.raw);

  // Finalizando a criação do PDF
  matriculaPdfDocument.end();

  // TODO: DEFINIR O NOME DO ARQUIVO ANTES DE ENVIAR

  // Retornando a resposta
  return reply;
}
