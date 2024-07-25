import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export const turmaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {},
    handler: () => {},
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:turmaId', {
    schema: {},
    handler: () => {},
  });

  // GET Turma
  server.withTypeProvider<ZodTypeProvider>().get('/:turmaId', {
    schema: {},
    handler: () => {},
  });
};
