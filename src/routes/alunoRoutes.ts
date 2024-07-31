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
  storeAlunoSchema,
  getAlunoSchema,
  getAlunosSchema,
  getAlunoResponsaveisSchema,
  updateAlunoSchema,
} from '../schemas/alunoSchema';

const alunosRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: storeAlunoSchema,
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
    schema: getAlunoResponsaveisSchema,
    handler: getResponsaveis,
  });
};
export default alunosRoutes;
