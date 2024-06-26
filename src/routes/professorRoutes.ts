import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  createProfessorSchema,
  getProfessorSchema,
  getProfessoresSchema,
  updateProfessorSchema,
} from '../schemas/professorSchemas';
import {
  createProfessor,
  getProfessor,
  getProfessores,
  updateProfessor,
} from '../controllers/professorController';

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
};

export default professoresRoutes;
