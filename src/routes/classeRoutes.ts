import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getClasseSchema,
  postClasseSchema,
  putClasseSchema,
} from '../schemas/classeSchemas';
import {
  createClasse,
  getClasse,
  updateClasse,
} from '../controllers/classeController';

export const classeRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: postClasseSchema,
    handler: createClasse,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:classeId', {
    schema: putClasseSchema,
    handler: updateClasse,
  });

  // // GET
  // server.withTypeProvider<ZodTypeProvider>().get('/', {
  //   schema: getClassesSchema,
  //   handler: () => {},
  // });

  // GET UNIQUE
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId', {
    schema: getClasseSchema,
    handler: getClasse,
  });
};
