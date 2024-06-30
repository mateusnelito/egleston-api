import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createAluno,
  getAluno,
  getAlunos,
  getResponsaveis,
  updateAluno,
} from '../controllers/alunoController';
import {
  createAlunoSchema,
  getAlunoSchema,
  getAlunosSchema,
  getResponsaveisSchema,
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

  // GET ALL Responsaveis
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId/responsaveis', {
    schema: getResponsaveisSchema,
    handler: getResponsaveis,
  });
};
export default alunosRoutes;
