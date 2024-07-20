import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export const classeRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {},
    handler: () => {},
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:classeId', {
    schema: {},
    handler: () => {},
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: {},
    handler: () => {},
  });

  // GET UNIQUE
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId', {
    schema: {},
    handler: () => {},
  });
};
