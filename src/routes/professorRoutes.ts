import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createMultiplesProfessorDisciplinaAssociationController,
  createProfessorController,
  createProfessorDisciplinaClasseAssociationController,
  deleteMultiplesProfessorDisciplinaAssociationController,
  deleteProfessorDisciplinaController,
  getProfessorController,
  getProfessorDisciplinaAssociationsController,
  getProfessorDisciplinaClasseTurmasController,
  getProfessorDisciplinaClassesController,
  getProfessoresController,
  updateProfessorController,
} from '../controllers/professorController';
import {
  createMultiplesProfessorDisciplinaAssociationSchema,
  createProfessorDisciplinaClasseAssociationSchema,
  createProfessorSchema,
  deleteMultiplesProfessorDisciplinaAssociationSchema,
  deleteProfessorDisciplinaSchema,
  getProfessorDisciplinaAssociationsSchema,
  getProfessorDisciplinaClasseTurmasSchema,
  getProfessorDisciplinaClassesSchema,
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

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:professorId/disciplinas', {
    schema: getProfessorDisciplinaAssociationsSchema,
    handler: getProfessorDisciplinaAssociationsController,
  });

  // POST MULTIPLES disciplinas TO ONE Professor
  server.withTypeProvider<ZodTypeProvider>().post('/:professorId/disciplinas', {
    schema: createMultiplesProfessorDisciplinaAssociationSchema,
    handler: createMultiplesProfessorDisciplinaAssociationController,
  });

  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/:professorId/classes', {
    schema: createProfessorDisciplinaClasseAssociationSchema,
    handler: createProfessorDisciplinaClasseAssociationController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:professorId/classes', {
    schema: getProfessorDisciplinaClassesSchema,
    handler: getProfessorDisciplinaClassesController,
  });

  // GET
  server
    .withTypeProvider<ZodTypeProvider>()
    .get('/:professorId/classes/:classeId/turmas', {
      schema: getProfessorDisciplinaClasseTurmasSchema,
      handler: getProfessorDisciplinaClasseTurmasController,
    });
};

export default professoresRoutes;
