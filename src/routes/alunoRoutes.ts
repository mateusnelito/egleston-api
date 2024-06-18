import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createAluno,
  getAluno,
  getAlunos,
  updateAluno,
} from '../controllers/alunoController';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createAlunoSchema,
  getAlunoSchema,
  getAlunosSchema,
  updateAlunoSchema,
} from '../schemas/alunoSchema';

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

  // GET ALL RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getAlunosSchema,
    handler: getAlunos,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId', {
    schema: getAlunoSchema,
    handler: getAluno,
  });
};
export default alunosRoutes; // Export all alunos sub-routes
