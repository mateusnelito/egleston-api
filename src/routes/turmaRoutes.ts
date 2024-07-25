import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { postTurmaSchema, putTurmaSchema } from '../schemas/turmaSchemas';
import {
  createTurmaController,
  updateTurmaController,
} from '../controllers/turmaControllers';

export const turmaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postTurmaSchema,
    handler: createTurmaController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:turmaId', {
    schema: putTurmaSchema,
    handler: updateTurmaController,
  });

  // GET Turma
  server.withTypeProvider<ZodTypeProvider>().get('/:turmaId', {
    schema: {},
    handler: () => {},
  });
};
