import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getAnoLectivoClassesSchema,
  getAnoLectivoSchema,
  getAnoLectivosSchema,
  createAnoLectivoSchema,
  createClasseToAnoLectivoSchema,
  updateAnoLectivoSchema,
} from '../schemas/anoLectivoSchema';
import {
  createClasseToAnoLectivoController,
  createAnoLectivoController,
  getAnoLectivoController,
  getAnoLectivoClassesController,
  getAnoLectivosController,
  updateAnoLectivoController,
} from '../controllers/anoLectivoController';

export const anoLectivoRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createAnoLectivoSchema,
    handler: createAnoLectivoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:anoLectivoId', {
    schema: updateAnoLectivoSchema,
    handler: updateAnoLectivoController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getAnoLectivosSchema,
    handler: getAnoLectivosController,
  });

  // GET UNIQUE
  server.withTypeProvider<ZodTypeProvider>().get('/:anoLectivoId', {
    schema: getAnoLectivoSchema,
    handler: getAnoLectivoController,
  });

  // GET Classes
  server.withTypeProvider<ZodTypeProvider>().get('/:anoLectivoId/classes', {
    schema: getAnoLectivoClassesSchema,
    handler: getAnoLectivoClassesController,
  });

  // POST classe in ano lectivo
  server.withTypeProvider<ZodTypeProvider>().post('/:anoLectivoId/classes', {
    schema: createClasseToAnoLectivoSchema,
    handler: createClasseToAnoLectivoController,
  });
};
