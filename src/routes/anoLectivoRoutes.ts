import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { postAnoLectivoSchema } from '../schemas/anoLectivoSchema';
import { createAnoLectivo } from '../controllers/anoLectivoController';

export const anoLectivoRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postAnoLectivoSchema,
    handler: createAnoLectivo,
  });
};
