import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getSalaSchema,
  postSalaSchema,
  putSalaSchema,
} from '../schemas/salaSchemas';
import {
  createSalaController,
  getSalaController,
  updateSalaController,
} from '../controllers/salaController';

export const salaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postSalaSchema,
    handler: createSalaController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:salaId', {
    schema: putSalaSchema,
    handler: updateSalaController,
  });

  // GET Unique
  server.withTypeProvider<ZodTypeProvider>().get('/:salaId', {
    schema: getSalaSchema,
    handler: getSalaController,
  });

  // GET All
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: {},
    handler: () => {},
  });
};
