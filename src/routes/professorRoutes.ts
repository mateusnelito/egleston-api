import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createMultiplesProfessorDisciplinaAssociationController,
  createProfessorController,
  createProfessorDisciplinaClasseAssociationController,
  deleteMultiplesProfessorDisciplinaAssociationController,
  deleteProfessorDisciplinaController,
  getProfessorController,
  getProfessoresController,
  updateProfessorController,
} from '../controllers/professorController';
import {
  createMultiplesProfessorDisciplinaAssociationSchema,
  createProfessorDisciplinaClasseAssociationSchema,
  createProfessorSchema,
  deleteMultiplesProfessorDisciplinaAssociationSchema,
  deleteProfessorDisciplinaSchema,
  getProfessorSchema,
  getProfessoresSchema,
  updateProfessorSchema,
} from '../schemas/professorSchemas';

const professoresRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createProfessorSchema,
    handler: createProfessorController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:professorId', {
    schema: updateProfessorSchema,
    handler: updateProfessorController,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:professorId', {
    schema: getProfessorSchema,
    handler: getProfessorController,
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getProfessoresSchema,
    handler: getProfessoresController,
  });

  // POST MULTIPLES disciplinas TO ONE Professor
  server.withTypeProvider<ZodTypeProvider>().post('/:professorId/disciplinas', {
    schema: createMultiplesProfessorDisciplinaAssociationSchema,
    handler: createMultiplesProfessorDisciplinaAssociationController,
  });

  // DELETE ASSOCIATION BETWEEN PROFESSOR AND DISCIPLINA
  server
    .withTypeProvider<ZodTypeProvider>()
    .delete('/:professorId/disciplinas/:disciplinaId', {
      schema: deleteProfessorDisciplinaSchema,
      handler: deleteProfessorDisciplinaController,
    });

  // DELETE ASSOCIATIONS BETWEEN MULTIPLES DISCIPLINAS AND ONE PROFESSOR
  server
    .withTypeProvider<ZodTypeProvider>()
    .delete('/:professorId/disciplinas', {
      schema: deleteMultiplesProfessorDisciplinaAssociationSchema,
      handler: deleteMultiplesProfessorDisciplinaAssociationController,
    });

  server.withTypeProvider<ZodTypeProvider>().post('/:professorId/classes', {
    schema: createProfessorDisciplinaClasseAssociationSchema,
    handler: createProfessorDisciplinaClasseAssociationController,
  });
};

export default professoresRoutes;
