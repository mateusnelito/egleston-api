import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createAluno, updateAluno } from '../controllers/alunoController';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createAlunoSchema, updateAlunoSchema } from '../schemas/alunoSchema';

// Create all alunos sub-routes
const alunosRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createAlunoSchema,
    handler: createAluno,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:alunoId', {
    schema: updateAlunoSchema,
    handler: updateAluno,
  });
};
export default alunosRoutes; // Export all alunos sub-routes
