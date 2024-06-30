import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createResponsavel,
  destroyResponsavel,
  getResponsavel,
  updateResponsavel,
} from '../controllers/responsavelController';
import {
  createResponsavelSchema,
  deleteResponsavelSchema,
  getResponsavelSchema,
  updateResponsavelSchema,
} from '../schemas/responsavelSchema';

// Create all responsavel sub-routes
const responsaveisRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/:alunoId/create', {
    schema: createResponsavelSchema,
    handler: createResponsavel,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:responsavelId', {
    schema: updateResponsavelSchema,
    handler: updateResponsavel,
  });

  // // DELETE UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().delete('/:responsavelId', {
    schema: deleteResponsavelSchema,
    handler: destroyResponsavel,
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:responsavelId', {
    schema: getResponsavelSchema,
    handler: getResponsavel,
  });
};
export default responsaveisRoutes;
