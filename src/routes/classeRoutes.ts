import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getClasseSchema,
  getClasseTurmasSchema,
  postClasseSchema,
  postClasseTurnoSchema,
  postTurmaToClasseSchema,
  putClasseSchema,
} from '../schemas/classeSchemas';
import {
  createClasse,
  createClasseTurnoController,
  createTurmaInClasseController,
  getClasse,
  getClasseTurmasController,
  updateClasse,
} from '../controllers/classeController';

export const classeRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postClasseSchema,
    handler: createClasse,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:classeId', {
    schema: putClasseSchema,
    handler: updateClasse,
  });

  // // GET
  // server.withTypeProvider<ZodTypeProvider>().get('/', {
  //   schema: getClassesSchema,
  //   handler: () => {},
  // });

  // GET UNIQUE
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId', {
    schema: getClasseSchema,
    handler: getClasse,
  });

  // GET Turmas
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId/turmas', {
    schema: getClasseTurmasSchema,
    handler: getClasseTurmasController,
  });

  // POST Turma
  server.withTypeProvider<ZodTypeProvider>().post('/:classeId/turmas', {
    schema: postTurmaToClasseSchema,
    handler: createTurmaInClasseController,
  });

  // POST ClasseTurno
  server.withTypeProvider<ZodTypeProvider>().post('/:classeId/turnos', {
    schema: postClasseTurnoSchema,
    handler: createClasseTurnoController,
  });
};
