import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createParentescoController,
  getParentescoController,
  getParentescosController,
  updateParentescoController,
} from '../controllers/parentescoController';
import {
  createParentescoSchema,
  getParentescoSchema,
  getParentescosSchema,
  updateParentescoSchema,
} from '../schemas/parentescoSchema';

// Create all parentesco sub-routes
const parentescosRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createParentescoSchema,
    handler: createParentescoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:parentescoId', {
    schema: updateParentescoSchema,
    handler: updateParentescoController,
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getParentescosSchema,
    handler: getParentescosController,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:parentescoId', {
    schema: getParentescoSchema,
    handler: getParentescoController,
  });
};
export default parentescosRoutes;
