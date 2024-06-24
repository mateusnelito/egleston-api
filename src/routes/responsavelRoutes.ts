import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createResponsavelSchema,
  deleteResponsavelSchema,
  getResponsavelSchema,
  updateResponsavelSchema,
} from '../schemas/responsavelSchema';
import {
  createResponsavel,
  destroyResponsavel,
  getResponsavel,
  updateResponsavel,
} from '../controllers/responsavelController';

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
export default responsaveisRoutes; // Export all alunos sub-routes
