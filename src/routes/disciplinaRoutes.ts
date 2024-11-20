import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createDisciplinaController,
  getDisciplinaController,
  getDisciplinasController,
  updateDisciplinaController,
} from '../controllers/disciplinaController';
import {
  createDisciplinaSchema,
  getDisciplinaSchema,
  getDisciplinasSchema,
  updateDisciplinaSchema,
} from '../schemas/disciplinaSchema';

const disciplinaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
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
};

export default disciplinaRoutes;
