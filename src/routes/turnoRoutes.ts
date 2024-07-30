import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createMultiplesClasseTurnoController,
  createTurnoController,
  getTurnoController,
  getTurnosController,
  updateTurnoController,
} from '../controllers/turnoController';
import {
  getTurnoSchema,
  getTurnosSchema,
  postMultiplesClassesInTurnoSchema,
  postTurnoSchema,
  putTurnoSchema,
} from '../schemas/turnoSchemas';

export const turnoRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postTurnoSchema,
    handler: createTurnoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:turnoId', {
    schema: putTurnoSchema,
    handler: updateTurnoController,
  });

  // GET Unique
  server.withTypeProvider<ZodTypeProvider>().get('/:turnoId', {
    schema: getTurnoSchema,
    handler: getTurnoController,
  });

  // GET all
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getTurnosSchema,
    handler: getTurnosController,
  });

  // POST Multiples ClasseTurno by turnoId
  server.withTypeProvider<ZodTypeProvider>().post('/:turnoId/classes', {
    schema: postMultiplesClassesInTurnoSchema,
    handler: createMultiplesClasseTurnoController,
  });
};
