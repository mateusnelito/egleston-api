import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  changeAnoLectivoStatusController,
  createAnoLectivoController,
  createClasseToAnoLectivoController,
  getAnoLectivoClassesController,
  getAnoLectivoController,
  getAnoLectivosController,
  getAnoLectivoTrimestresController,
  updateAnoLectivoController,
} from '../controllers/anoLectivoController';
import {
  changeAnoLectivoStatusesSchema,
  createAnoLectivoSchema,
  createClasseToAnoLectivoSchema,
  getAnoLectivoClassesSchema,
  getAnoLectivoSchema,
  getAnoLectivosSchema,
  getAnoLectivoTrimestresSchema,
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
    schema: changeAnoLectivoStatusesSchema,
    handler: changeAnoLectivoStatusController,
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
  // server.withTypeProvider<ZodTypeProvider>().get('/:anoLectivoId/classes', {
  //   schema: getAnoLectivoClassesSchema,
  //   handler: getAnoLectivoClassesController,
  // });

  // POST classe in ano lectivo
  server.withTypeProvider<ZodTypeProvider>().post('/:anoLectivoId/classes', {
    schema: createClasseToAnoLectivoSchema,
    handler: createClasseToAnoLectivoController,
  });

  // GET Trimestres
  server.withTypeProvider<ZodTypeProvider>().get('/:anoLectivoId/trimestres', {
    schema: getAnoLectivoTrimestresSchema,
    handler: getAnoLectivoTrimestresController,
  });
};
