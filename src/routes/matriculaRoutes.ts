import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createMatriculaController } from '../controllers/matriculaController';
import { createMatriculaSchema } from '../schemas/matriculaSchemas';

export const matriculaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createMatriculaSchema,
    handler: createMatriculaController,
  });
};
