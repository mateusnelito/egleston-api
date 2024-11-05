import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import BadRequest from './BadRequest';
import HttpStatusCodes from './HttpStatusCodes';

// Formate date to yyyy-mm-dd
export function formatDate(date: Date): String {
  return date.toISOString().slice(0, 10);
}

export function isBeginDateAfterEndDate(begin: Date, end: Date): boolean {
  return dayjs(begin).isAfter(dayjs(end));
}

export function isDateBetweenDateIntervals(
  date: Date,
  begin: Date,
  end: Date
): boolean {
  dayjs.extend(isBetween);
  return dayjs(date).isBetween(begin, end);
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
export function arrayHasDuplicatedItems(array: Array<any>) {
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

// Agrupa elementos de um array com base em uma chave extraída de cada item.
// Permite personalizar como a chave e o valor são extraídos através de funções fornecidas.
// A função aceita um nome para o array que armazenará os valores agrupados.
export function groupBy<ItemType, KeyType, ValueType>(
  array: ItemType[],
  keyFn: (item: ItemType) => KeyType, // Função para extrair a chave de agrupamento de cada item
  valueFn: (item: ItemType) => ValueType, // Função para extrair o valor a ser agrupado
  groupValueFn: (item: ItemType) => unknown, // Função para extrair o valor a ser adicionado ao array
  valueArrayName: string // Nome do array que armazenará os valores agrupados
) {
  // 1. Inicializa um mapa para armazenar os agrupamentos.
  const map = new Map<KeyType, { [key: string]: unknown }>();

  // 2. Percorre cada elemento do array fornecido.
  for (const item of array) {
    // 3. Extrai a chave de agrupamento utilizando a função `keyFn`.
    const key = keyFn(item);

    // 4. Extrai o valor a ser adicionado utilizando a função `valueFn`.
    const value = valueFn(item);
    const groupValue = groupValueFn(item);

    if (!map.has(key)) {
      // 5. Se a chave ainda não existe no mapa, inicializa uma nova entrada para ela.
      map.set(key, { ...value, [valueArrayName]: [] });
    }

    // 6. Adiciona o valor extraído ao array correspondente no objeto do mapa.
    (map.get(key)![valueArrayName] as unknown[]).push(groupValue);
  }

  // 7. Converte o mapa de agrupamentos de volta em um array e o retorna.
  return Array.from(map.values());
}
