import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createCursoController,
  getCursoClassesController,
  getCursoController,
  getCursosController,
  updateCursoController,
} from '../controllers/cursoController';
import {
  createCursoSchema,
  getCursoClassesSchema,
  getCursoSchema,
  getCursosSchema,
  updateCursoSchema,
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

  // GET All Classes
  server.withTypeProvider<ZodTypeProvider>().get('/:cursoId/classes', {
    schema: getCursoClassesSchema,
    handler: getCursoClassesController,
  });
};

export default cursosRoutes;
