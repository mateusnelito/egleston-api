import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getAlunosWithoutNotaSchema } from '../schemas/notaSchema';
import { getAlunosWithoutNotaController } from '../controllers/notaController';

const notaRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Get all Alunos Without Notas
  server.withTypeProvider<ZodTypeProvider>().get('/alunos/sem-notas', {
    schema: getAlunosWithoutNotaSchema,
    handler: getAlunosWithoutNotaController,
  });
};
export default notaRoutes;
