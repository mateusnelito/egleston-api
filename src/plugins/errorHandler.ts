import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { ZodError } from 'zod';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import formatZodErrors from '../utils/formatZodErrors';

// Create a plugin to handle global errors
async function errorHandlerPlugin(server: FastifyInstance) {
  server.setErrorHandler((err, _, reply) => {
    // Check if is zod validation error
    if (err instanceof ZodError) {
      return reply.status(HttpStatusCodes.BAD_REQUEST).send({
        statusCode: HttpStatusCodes.BAD_REQUEST,
        message: 'Input validation error',
        errors: formatZodErrors(err), // Call the function to format the errors
      });
    }

    // Check if is a BadRequest Class error
    if (err instanceof BadRequest) {
      // use the sendErrors method of BadRequest Class Error
      return err.sendErrors(reply);
    }

    console.error(err);

    // TODO: Add a handler error for bad json format

    return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error!',
      // FIXME: Remove the line above after dev mode finish
      errors: err,
    });
  });
}

// Export the fn as fastify plugin
export default fastifyPlugin(errorHandlerPlugin);
