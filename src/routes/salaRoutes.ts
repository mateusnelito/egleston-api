import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { postSalaSchema } from '../schemas/salaSchemas';
import { createSalaController } from '../controllers/salaController';

export const salaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postSalaSchema,
    handler: createSalaController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:salaId', {
    schema: {},
    handler: () => {},
  });

  // GET Unique
  server.withTypeProvider<ZodTypeProvider>().get('/:salaId', {
    schema: {},
    handler: () => {},
  });

  // GET All
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: {},
    handler: () => {},
  });
};
