import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  confirmAlunoMatriculaController,
  createAlunoResponsavelController,
  getActualAlunoClasseController,
  getAlunoClassesController,
  getAlunoController,
  getAlunoMatriculasController,
  getAlunoNotasController,
  getAlunoResponsaveisController,
  getAlunosController,
  updateAlunoController,
  updateAlunoNotaController,
} from '../controllers/alunoController';
import {
  confirmAlunoMatriculaSchema,
  createAlunoResponsavelSchema,
  getActualAlunoClasseSchema,
  getAlunoClassesSchema,
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
  server
    .withTypeProvider<ZodTypeProvider>()
    // TODO: Rename to appropriate endpoint name
    .post('/:alunoId/matriculas/confirm', {
      schema: confirmAlunoMatriculaSchema,
      handler: confirmAlunoMatriculaController,
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

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId/classes', {
    schema: getAlunoClassesSchema,
    handler: getAlunoClassesController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:alunoId/classes/actual', {
    schema: getActualAlunoClasseSchema,
    handler: getActualAlunoClasseController,
  });
};

export default alunosRoutes;
