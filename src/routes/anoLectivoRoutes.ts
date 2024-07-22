import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getAnoLectivoClassesSchema,
  getAnoLectivoSchema,
  getAnoLectivosSchema,
  postAnoLectivoSchema,
  putAnoLectivoSchema,
} from '../schemas/anoLectivoSchema';
import {
  createAnoLectivo,
  getAnoLectivo,
  getAnoLectivoClasses,
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

  // GET UNIQUE
  server.withTypeProvider<ZodTypeProvider>().get('/:anoLectivoId', {
    schema: getAnoLectivoSchema,
    handler: getAnoLectivo,
  });

  // GET Classes
  server.withTypeProvider<ZodTypeProvider>().get('/:anoLectivoId/classes', {
    schema: getAnoLectivoClassesSchema,
    handler: getAnoLectivoClasses,
  });
};
