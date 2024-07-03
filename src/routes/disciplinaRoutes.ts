import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  associateDisciplinaWithCursos,
  createDisciplina,
  getDisciplina,
  getDisciplinas,
  updateDisciplina,
} from '../controllers/disciplinaController';
import {
  associateCursosWithDisciplinaSchema,
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
    handler: createDisciplina,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:disciplinaId', {
    schema: updateDisciplinaSchema,
    handler: updateDisciplina,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:disciplinaId', {
    schema: getDisciplinaSchema,
    handler: getDisciplina,
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getDisciplinasSchema,
    handler: getDisciplinas,
  });

  // POST ASSOCIATION BETWEEN MULTIPLES CURSO AND ONE DISCIPLINA
  server.withTypeProvider<ZodTypeProvider>().post('/:disciplinaId/cursos', {
    schema: associateCursosWithDisciplinaSchema,
    handler: associateDisciplinaWithCursos,
  });
};

export default disciplinaRoutes;
