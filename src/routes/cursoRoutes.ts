import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createMultiplesCursoDisciplinaByCursoController,
  createClasseToCursoController,
  createCursoController,
  deleteMultiplesCursoDisciplinasController,
  deleteCursoDisciplinaController,
  getCursoController,
  getCursoClassesController,
  getCursosController,
  updateCursoController,
} from '../controllers/cursoController';
import {
  createMultiplesCursoDisciplinaSchema,
  createCursoSchema,
  deleteMultiplesCursoDisciplinaSchema,
  deleteCursoDisciplinaSchema,
  getCursoClassesSchema,
  getCursoSchema,
  getCursosSchema,
  updateCursoSchema,
  createClasseToCursoSchema,
} from '../schemas/cursoSchema';

const cursosRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createCursoSchema,
    handler: createCursoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:cursoId', {
    schema: updateCursoSchema,
    handler: updateCursoController,
  });

  // GET ALL RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getCursosSchema,
    handler: getCursosController,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:cursoId', {
    schema: getCursoSchema,
    handler: getCursoController,
  });

  // POST ASSOCIATION BETWEEN MULTIPLES DISCIPLINAS AND ONE CURSO
  server.withTypeProvider<ZodTypeProvider>().post('/:cursoId/disciplinas', {
    schema: createMultiplesCursoDisciplinaSchema,
    handler: createMultiplesCursoDisciplinaByCursoController,
  });

  // DELETE ASSOCIATION BETWEEN CURSO AND DISCIPLINA
  server
    .withTypeProvider<ZodTypeProvider>()
    .delete('/:cursoId/disciplinas/:disciplinaId', {
      schema: deleteCursoDisciplinaSchema,
      handler: deleteCursoDisciplinaController,
    });

  // DELETE ASSOCIATIONS BETWEEN MULTIPLES DISCIPLINAS AND ONE CURSO
  server.withTypeProvider<ZodTypeProvider>().delete('/:cursoId/disciplinas', {
    schema: deleteMultiplesCursoDisciplinaSchema,
    handler: deleteMultiplesCursoDisciplinasController,
  });

  // GET All Classes
  server.withTypeProvider<ZodTypeProvider>().get('/:cursoId/classes', {
    schema: getCursoClassesSchema,
    handler: getCursoClassesController,
  });

  // POST a classe to curso
  server.withTypeProvider<ZodTypeProvider>().post('/:cursoId/classes', {
    schema: createClasseToCursoSchema,
    handler: createClasseToCursoController,
  });
};

export default cursosRoutes;
