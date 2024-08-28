import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createAlunoAndMatriculaController } from '../controllers/matriculaController';
import { createAlunoAndMatriculaSchema } from '../schemas/matriculaSchemas';

export const matriculaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createAlunoAndMatriculaSchema,
    handler: createAlunoAndMatriculaController,
  });
};
