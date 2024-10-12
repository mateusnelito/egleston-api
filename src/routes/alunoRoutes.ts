import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createAlunoResponsavelController,
  createMatriculaToAlunoController,
  getAlunoController,
  getAlunoMatriculasController,
  getAlunoNotasController,
  getAlunoResponsaveisController,
  getAlunosController,
  updateAlunoController,
  updateAlunoNotaController,
} from '../controllers/alunoController';
import {
  createAlunoResponsavelSchema,
  createMatriculaToAlunoSchema,
  getAlunoMatriculasSchema,
  getAlunoNotasSchemas,
  getAlunoResponsaveisSchema,
  getAlunoSchema,
  getAlunosSchema,
  updateAlunoNotaSchema,
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

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId/matriculas', {
    schema: getAlunoMatriculasSchema,
    handler: getAlunoMatriculasController,
  });

  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/:alunoId/matriculas', {
    schema: createMatriculaToAlunoSchema,
    handler: createMatriculaToAlunoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:alunoId/notas', {
    schema: updateAlunoNotaSchema,
    handler: updateAlunoNotaController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId/notas', {
    schema: getAlunoNotasSchemas,
    handler: getAlunoNotasController,
  });
};

export default alunosRoutes;
