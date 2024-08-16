import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createAlunoResponsavelController,
  getAlunoController,
  getAlunoResponsaveisController,
  getAlunosController,
  updateAlunoController,
} from '../controllers/alunoController';
import {
  createAlunoResponsavelSchema,
  getAlunoResponsaveisSchema,
  getAlunoSchema,
  getAlunosSchema,
  updateAlunoSchema,
} from '../schemas/alunoSchemas';

const alunosRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:alunoId', {
    schema: updateAlunoSchema,
    handler: updateAlunoController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getAlunosSchema,
    handler: getAlunosController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId', {
    schema: getAlunoSchema,
    handler: getAlunoController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId/responsaveis', {
    schema: getAlunoResponsaveisSchema,
    handler: getAlunoResponsaveisController,
  });

  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/:alunoId/responsaveis', {
    schema: createAlunoResponsavelSchema,
    handler: createAlunoResponsavelController,
  });
};
export default alunosRoutes;
