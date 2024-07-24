import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { postTurnoSchema } from '../schemas/turnoSchemas';
import { createTurnoController } from '../controllers/turnoController';

export const turnoRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postTurnoSchema,
    handler: createTurnoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:turnoId', {
    schema: {},
    handler: () => {},
  });

  // GET Unique
  server.withTypeProvider<ZodTypeProvider>().get('/:turnoId', {
    schema: {},
    handler: () => {},
  });

  // GET all
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: {},
    handler: () => {},
  });
};
