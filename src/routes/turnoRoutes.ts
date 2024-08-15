import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createTurnoController,
  getTurnoController,
  getTurnosController,
  updateTurnoController,
} from '../controllers/turnoController';
import {
  getTurnoSchema,
  getTurnosSchema,
  createTurnoSchema,
  updateTurnoSchema,
} from '../schemas/turnoSchemas';

export const turnoRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createTurnoSchema,
    handler: createTurnoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:turnoId', {
    schema: updateTurnoSchema,
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
};
