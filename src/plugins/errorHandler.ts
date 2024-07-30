import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { ZodError } from 'zod';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import NotFoundRequest from '../utils/NotFoundRequest';
import formatZodErrors from '../utils/formatZodErrors';

// Create a plugin to handle global errors
async function errorHandlerPlugin(server: FastifyInstance) {
  server.setErrorHandler((err, _request, reply) => {
    // Verifica se é um erro de validação do Zod
    if (err instanceof ZodError) {
      return reply.status(HttpStatusCodes.BAD_REQUEST).send({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Erro durante a validação da request',
        errors: formatZodErrors(err), // Chama a função para formatar os erros
      });
    }

    // Check if is a BadRequest Class error
    if (err instanceof BadRequest) {
      // use the Errors method of BadRequest Class Error
      return err.sendErrors(reply);
    }

    // Check if is a NotFoundRequest Class error
    if (err instanceof NotFoundRequest) {
      // use the sendError method of NotFoundRequest Class Error
      return err.sendError(reply);
    }

    console.error(err); // Show debug error

    // TODO: Add a handler error for bad json format

    // If isn't the errors above
    return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error!',
      // TODO: Remove the line above after dev mode finish
      errors: err,
    });
  });
}

// Export the fn as fastify plugin
export default fastifyPlugin(errorHandlerPlugin);
