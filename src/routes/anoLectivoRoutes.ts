import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getAnoLectivosSchema,
  postAnoLectivoSchema,
  putAnoLectivoSchema,
} from '../schemas/anoLectivoSchema';
import {
  createAnoLectivo,
  getAnoLectivos,
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

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getAnoLectivosSchema,
    handler: getAnoLectivos,
  });
};
