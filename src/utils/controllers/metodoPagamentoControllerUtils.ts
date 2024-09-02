import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export function throwInvalidMetodoPagamentoNomeError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome de metodo de pagamento inválido.',
    errors: { nome: ['O nome de metodo de pagamento já existe.'] },
  });
}

export function throwNotFoundMetodoPagamentoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID de metodo de pagamento não existe.',
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
