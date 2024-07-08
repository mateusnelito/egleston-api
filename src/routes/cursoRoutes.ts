import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  associateCursoWithDisciplinas,
  createCurso,
  deleteCursoWithDisciplinasAssociation,
  destroyCursoDisciplina,
  getCurso,
  getCursos,
  updateCurso,
} from '../controllers/cursoController';
import {
  createCursoDisciplinasAssociationSchema,
  createCursoSchema,
  deleCursoDisciplinasAssociationSchema,
  deleteCursoDisciplinaAssociationSchema,
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

  // POST ASSOCIATION BETWEEN MULTIPLES DISCIPLINAS AND ONE CURSO
  server.withTypeProvider<ZodTypeProvider>().post('/:cursoId/disciplinas', {
    schema: createCursoDisciplinasAssociationSchema,
    handler: associateCursoWithDisciplinas,
  });

  // DELETE ASSOCIATION BETWEEN CURSO AND DISCIPLINA
  server
    .withTypeProvider<ZodTypeProvider>()
    .delete('/:cursoId/disciplinas/:disciplinaId', {
      schema: deleteCursoDisciplinaAssociationSchema,
      handler: destroyCursoDisciplina,
    });

  // DELETE ASSOCIATIONS BETWEEN MULTIPLES DISCIPLINAS AND ONE CURSO
  server.withTypeProvider<ZodTypeProvider>().delete('/:cursoId/disciplinas', {
    schema: deleCursoDisciplinasAssociationSchema,
    handler: deleteCursoWithDisciplinasAssociation,
  });
};

export default cursosRoutes;
