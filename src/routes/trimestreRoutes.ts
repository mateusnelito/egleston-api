import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createTrimestreSchema,
  getTrimestresSchema,
} from '../schemas/trimestreSchemas';
import {
  createTrimestreController,
  getTrimestresController,
} from '../controllers/trimestreController';

export const trimestreRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createTrimestreSchema,
    handler: createTrimestreController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getTrimestresSchema,
    handler: getTrimestresController,
  });
};
