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
  updateResponsavelSchema,
} from '../schemas/responsavelSchema';
import {
  createResponsavel,
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

  // // GET ALL RESOURCES
  // server.withTypeProvider<ZodTypeProvider>().get('/:alunoId', {
  //   schema: getParentescosSchema,
  //   handler: getParentescos,
  // });

  // // GET UNIQUE RESOURCE
  // server.withTypeProvider<ZodTypeProvider>().get('/:responsavelId', {
  //   schema: getParentescoSchema,
  //   handler: getParentesco,
  // });
};
export default responsaveisRoutes; // Export all alunos sub-routes
