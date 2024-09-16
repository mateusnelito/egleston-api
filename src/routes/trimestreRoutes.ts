import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createTrimestreSchema } from '../schemas/trimestreSchemas';
import { createTrimestreController } from '../controllers/trimestreController';

export const trimestreRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createTrimestreSchema,
    handler: createTrimestreController,
  });
};
