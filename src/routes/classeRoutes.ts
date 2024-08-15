import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getClasseSchema,
  getClasseTurmasSchema,
  createClasseSchema,
  createTurmaToClasseSchema,
  updateClasseSchema,
} from '../schemas/classeSchemas';
import {
  createClasseController,
  createTurmaInClasseController,
  getClasseController,
  getClasseTurmasController,
  updateClasseController,
} from '../controllers/classeController';

export const classeRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createClasseSchema,
    handler: createClasseController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:classeId', {
    schema: updateClasseSchema,
    handler: updateClasseController,
  });

  // // GET
  // server.withTypeProvider<ZodTypeProvider>().get('/', {
  //   schema: getClassesSchema,
  //   handler: () => {},
  // });

  // GET UNIQUE
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId', {
    schema: getClasseSchema,
    handler: getClasseController,
  });

  // GET Turmas
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId/turmas', {
    schema: getClasseTurmasSchema,
    handler: getClasseTurmasController,
  });

  // POST Turma
  server.withTypeProvider<ZodTypeProvider>().post('/:classeId/turmas', {
    schema: createTurmaToClasseSchema,
    handler: createTurmaInClasseController,
  });
};
