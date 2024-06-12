import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createAluno } from '../controllers/alunoController';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createAlunoSchema } from '../schemas/alunoSchema';

// Create all alunos sub-routes
const alunosRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createAlunoSchema,
    handler: createAluno,
  });
};
export default alunosRoutes; // Export all alunos sub-routes
