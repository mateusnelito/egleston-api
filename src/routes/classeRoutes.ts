import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getClasseSchema,
  getClasseTurmasSchema,
  createClasseSchema,
  deleteMultiplesClasseTurnoSchema,
  createTurmaToClasseSchema,
  updateClasseSchema,
  createMultiplesClasseTurnoSchema,
  deleteClasseTurnoSchema,
} from '../schemas/classeSchemas';
import {
  createClasseController,
  createClasseTurnoController,
  createTurmaInClasseController,
  deleteClasseTurnoController,
  deleteMultiplesClasseTurnoController,
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

  // POST Multiples ClasseTurnos
  server.withTypeProvider<ZodTypeProvider>().post('/:classeId/turnos', {
    schema: createMultiplesClasseTurnoSchema,
    handler: createClasseTurnoController,
  });

  // DELETE Multiples ClasseTurnos
  server.withTypeProvider<ZodTypeProvider>().delete('/:classeId/turnos', {
    schema: deleteMultiplesClasseTurnoSchema,
    handler: deleteMultiplesClasseTurnoController,
  });

  // DELETE ClasseTurno
  server
    .withTypeProvider<ZodTypeProvider>()
    .delete('/:classeId/turnos/:turnoId', {
      schema: deleteClasseTurnoSchema,
      handler: deleteClasseTurnoController,
    });
};
