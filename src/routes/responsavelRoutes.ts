import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  deleteResponsavelController,
  getResponsavelController,
  updateResponsavelController,
} from '../controllers/responsavelController';
import {
  deleteResponsavelSchema,
  getResponsavelSchema,
  updateResponsavelSchema,
} from '../schemas/responsavelSchema';

// Create all responsavel sub-routes
const responsaveisRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:responsavelId', {
    schema: updateResponsavelSchema,
    handler: updateResponsavelController,
  });

  // // DELETE UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().delete('/:responsavelId', {
    schema: deleteResponsavelSchema,
    handler: deleteResponsavelController,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:responsavelId', {
    schema: getResponsavelSchema,
    handler: getResponsavelController,
  });
};
export default responsaveisRoutes;
