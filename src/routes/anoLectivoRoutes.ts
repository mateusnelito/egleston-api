import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  postAnoLectivoSchema,
  putAnoLectivoSchema,
} from '../schemas/anoLectivoSchema';
import {
  createAnoLectivo,
  updateAnoLectivo,
} from '../controllers/anoLectivoController';

export const anoLectivoRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postAnoLectivoSchema,
    handler: createAnoLectivo,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:anoLectivoId', {
    schema: putAnoLectivoSchema,
    handler: updateAnoLectivo,
  });
};
