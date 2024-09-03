import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwInvalidMetodoPagamentoNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de metodo de pagamento inválido.',
    errors: { nome: ['O nome de metodo de pagamento já existe.'] },
  });
}

export function throwNotFoundMetodoPagamentoIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Metodo de pagamento não existe.',
  });
}

export function throwNotFoundMetodoPagamentoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Metodo de pagamento inválido.',
    errors: {
      metodoPagamentoId: ['ID metodo de pagamento não existe.'],
    },
  });
}
