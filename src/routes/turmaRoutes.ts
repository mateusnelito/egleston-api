import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createTurmaController,
  getTurmaController,
  updateTurmaController,
} from '../controllers/turmaControllers';
import {
  getTurmaSchema,
  createTurmaSchema,
  updateTurmaSchema,
} from '../schemas/turmaSchemas';

export const turmaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createTurmaSchema,
    handler: createTurmaController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:turmaId', {
    schema: updateTurmaSchema,
    handler: updateTurmaController,
  });

  // GET Turma
  server.withTypeProvider<ZodTypeProvider>().get('/:turmaId', {
    schema: getTurmaSchema,
    handler: getTurmaController,
  });
};
