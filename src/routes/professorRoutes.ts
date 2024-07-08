import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  associateProfessorWithDisciplinas,
  createProfessor,
  deleteProfessorWithDisciplinasAssociation,
  destroyProfessorDisciplina,
  getProfessor,
  getProfessores,
  updateProfessor,
} from '../controllers/professorController';
import {
  createProfessorDisciplinasAssociationSchema,
  createProfessorSchema,
  deleProfessorDisciplinasAssociationSchema,
  deleteProfessorDisciplinaAssociationSchema,
  getProfessorSchema,
  getProfessoresSchema,
  updateProfessorSchema,
} from '../schemas/professorSchemas';

const professoresRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createProfessorSchema,
    handler: createProfessor,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:professorId', {
    schema: updateProfessorSchema,
    handler: updateProfessor,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:professorId', {
    schema: getProfessorSchema,
    handler: getProfessor,
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getProfessoresSchema,
    handler: getProfessores,
  });

  // POST MULTIPLES disciplinas TO ONE Professor
  server.withTypeProvider<ZodTypeProvider>().post('/:professorId/disciplinas', {
    schema: createProfessorDisciplinasAssociationSchema,
    handler: associateProfessorWithDisciplinas,
  });

  // DELETE ASSOCIATION BETWEEN PROFESSOR AND DISCIPLINA
  server
    .withTypeProvider<ZodTypeProvider>()
    .delete('/:professorId/disciplinas/:disciplinaId', {
      schema: deleteProfessorDisciplinaAssociationSchema,
      handler: destroyProfessorDisciplina,
    });

  // DELETE ASSOCIATIONS BETWEEN MULTIPLES DISCIPLINAS AND ONE PROFESSOR
  server
    .withTypeProvider<ZodTypeProvider>()
    .delete('/:professorId/disciplinas', {
      schema: deleProfessorDisciplinasAssociationSchema,
      handler: deleteProfessorWithDisciplinasAssociation,
    });
};

export default professoresRoutes;
