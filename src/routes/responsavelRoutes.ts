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
import {
  createResponsavelSchema,
  deleteResponsavelSchema,
  updateResponsavelSchema,
} from '../schemas/responsavelSchema';
import {
  createResponsavel,
  destroyResponsavel,
  updateResponsavel,
} from '../controllers/responsavelController';

// Create all parentesco sub-routes
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

  // // GET UNIQUE RESOURCE
  // server.withTypeProvider<ZodTypeProvider>().get('/:responsavelId', {
  //   schema: getParentescoSchema,
  //   handler: getParentesco,
  // });
};
export default responsaveisRoutes; // Export all alunos sub-routes
