import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createAnoLectivoController,
  createClasseToAnoLectivoController,
  getAnoLectivoClassesController,
  getAnoLectivoController,
  getAnoLectivosController,
  patchAnoLectivoController,
  updateAnoLectivoController,
} from '../controllers/anoLectivoController';
import {
  createAnoLectivoSchema,
  createClasseToAnoLectivoSchema,
  getAnoLectivoClassesSchema,
  getAnoLectivoSchema,
  getAnoLectivosSchema,
  patchAnoLectivoSchema,
  updateAnoLectivoSchema,
} from '../schemas/anoLectivoSchema';

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

  // PATCH
  server.withTypeProvider<ZodTypeProvider>().patch('/:anoLectivoId', {
    schema: patchAnoLectivoSchema,
    handler: patchAnoLectivoController,
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
