import { createAlunoNotaBodyType } from '../schemas/alunoSchemas';
import { throwNotFoundClasseIdFieldError } from '../utils/controllers/classeControllerUtils';
import { throwInvalidDisciplinaIdFieldError } from '../utils/controllers/disciplinaControllerUtils';
import { throwInvalidTrimestreIdFieldError } from '../utils/controllers/trimestreControllerUtils';
import { getClasseId } from './classeServices';
import { getDisciplinaId } from './disciplinaServices';
import { getTrimestreId } from './trimestreServices';

export async function validateAlunoNotaData(data: createAlunoNotaBodyType) {
  const { classeId, disciplinaId, trimestreId } = data;

  const [classe, disciplina, trimestre] = await Promise.all([
    getClasseId(classeId),
    getDisciplinaId(disciplinaId),
    getTrimestreId(trimestreId),
  ]);

  if (!classe) throwNotFoundClasseIdFieldError();

  if (!disciplina) throwInvalidDisciplinaIdFieldError('Disciplina não existe');

  if (!trimestre) throwInvalidTrimestreIdFieldError();
}
