import { FastifyReply, FastifyRequest } from 'fastify';
import { createMatriculaBodyType } from '../schemas/matriculaSchemas';
import { createAlunoWithMatricula } from '../services/alunoServices';
import { validateAlunoData } from '../services/alunoValidationService';
import { validateMatriculaData } from '../services/matriculaValidationService';
import { createPagamento } from '../services/pagamentoServices';
import { validateResponsavelData } from '../services/responsaveisValidationServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { arrayHasDuplicatedValue } from '../utils/utils';
import { createMatricula } from '../services/matriculaServices';

export async function createMatriculaController(
  request: FastifyRequest<{ Body: createMatriculaBodyType }>,
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

  const matricula = await createMatricula(data);

  // TODO: GENERATE THE RELATOR OR *COMPROVANTE
  return reply.send(matricula);
}
