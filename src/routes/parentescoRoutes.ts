import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createParentescoSchema,
  getParentescoSchema,
  getParentescosSchema,
  updateParentescoSchema,
} from '../schemas/parentescoSchema';
import {
  createParentesco,
  getParentesco,
  getParentescos,
  updateParentesco,
} from '../controllers/parentescoController';

// Create all parentesco sub-routes
const parentescosRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createParentescoSchema,
    handler: createParentesco,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:parentescoId', {
    schema: updateParentescoSchema,
    handler: updateParentesco,
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getParentescosSchema,
    handler: getParentescos,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:parentescoId', {
    schema: getParentescoSchema,
    handler: getParentesco,
  });
};
export default parentescosRoutes; // Export all alunos sub-routes
