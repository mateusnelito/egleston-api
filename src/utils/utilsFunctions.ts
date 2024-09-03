import dayjs from 'dayjs';
import BadRequest from './BadRequest';
import HttpStatusCodes from './HttpStatusCodes';

// Formate date to yyyy-mm-dd
export function formatDate(date: Date): String {
  return date.toISOString().slice(0, 10);
}

export function isBeginDateAfterEndDate(begin: Date, end: Date): boolean {
  return dayjs(begin).isAfter(dayjs(end));
}

export function calculateTimeBetweenDates(
  begin: Date,
  end: Date,
  unit: dayjs.UnitType
): number {
  return dayjs(end).diff(dayjs(begin), unit);
}

// Only work with primitive values: 1, 2, 3 || "a", "b", "c"
// Not with objects
export function arrayHasDuplicatedValue(array: Array<any>) {
  return new Set(array).size !== array.length;
}

export function throwDuplicatedEmailError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Endereço de email inválido.',
    errors: {
      contacto: { email: ['Endereço de email existe.'] },
    },
  });
}

export function throwDuplicatedTelefoneError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Número de telefone inválido.',
    errors: {
      contacto: { telefone: ['Número de telefone já existe.'] },
    },
  });
}

export function throwInvalidDataNascimentoError(message: string) {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de nascimento inválida.',
    errors: { dataNascimento: [message] },
  });
}
