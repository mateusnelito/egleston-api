import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createAlunoMatriculaController } from '../controllers/matriculaController';
import { createAlunoMatriculaSchema } from '../schemas/matriculaSchemas';

export const matriculaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createAlunoMatriculaSchema,
    handler: createAlunoMatriculaController,
  });
};
