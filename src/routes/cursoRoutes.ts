import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createCurso,
  getCurso,
  getCursos,
  updateCurso,
} from '../controllers/cursoController';
import {
  createCursoSchema,
  getCursoSchema,
  getCursosSchema,
  updateCursoSchema,
} from '../schemas/cursoSchema';

const cursosRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createCursoSchema,
    handler: createCurso,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:cursoId', {
    schema: updateCursoSchema,
    handler: updateCurso,
  });

  // GET ALL RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getCursosSchema,
    handler: getCursos,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:cursoId', {
    schema: getCursoSchema,
    handler: getCurso,
  });
};

export default cursosRoutes;
