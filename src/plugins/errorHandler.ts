import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { ZodError } from 'zod';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import BadRequest from '../utils/BadRequest';

// Create a plugin to handle global errors
async function errorHandlerPlugin(server: FastifyInstance) {
  server.setErrorHandler((err, _request, reply) => {
    // Checks if it is a zod validation error
    if (err instanceof ZodError) {
      return reply.status(HttpStatusCodes.BAD_REQUEST).send({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Erro durante a validação da request',
        errors: err.flatten().fieldErrors, // Grab all the invalid fields
      });
    }

    // Check if is a BadRequest Class error
    if (err instanceof BadRequest) {
      // use the sendResponse method of BadRequest Class Error
      return err.sendResponse(reply);
    }

    console.error(err); // Show debug error

    // TODO: Add a handler error for bad json format

    // If isn't the errors above
    return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error!',
      // FIXME: Remove the line after dev mode finish
      errors: err,
    });
  });
}

// Export the fn as fastify plugin
export default fastifyPlugin(errorHandlerPlugin);
