import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createMultiplesCursoDisciplinaByDisciplinaController,
  createDisciplinaController,
  getDisciplinaController,
  getDisciplinasController,
  updateDisciplinaController,
} from '../controllers/disciplinaController';
import {
  createMultiplesCursoDisciplinaSchema,
  createDisciplinaSchema,
  getDisciplinaSchema,
  getDisciplinasSchema,
  updateDisciplinaSchema,
} from '../schemas/disciplinaSchema';

const disciplinaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createDisciplinaSchema,
    handler: createDisciplinaController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:disciplinaId', {
    schema: updateDisciplinaSchema,
    handler: updateDisciplinaController,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:disciplinaId', {
    schema: getDisciplinaSchema,
    handler: getDisciplinaController,
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getDisciplinasSchema,
    handler: getDisciplinasController,
  });

  // POST ASSOCIATION BETWEEN MULTIPLES CURSO AND ONE DISCIPLINA
  server.withTypeProvider<ZodTypeProvider>().post('/:disciplinaId/cursos', {
    schema: createMultiplesCursoDisciplinaSchema,
    handler: createMultiplesCursoDisciplinaByDisciplinaController,
  });
};

export default disciplinaRoutes;
