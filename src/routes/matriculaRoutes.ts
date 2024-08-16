import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export const matriculaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {},
    handler: () => {},
  });
};
