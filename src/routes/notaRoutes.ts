import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createNotaController,
  getAlunosWithoutNotaController,
} from '../controllers/notaController';
import {
  createNotaSchema,
  getAlunosWithoutNotaSchema,
} from '../schemas/notaSchema';

const notaRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createNotaSchema,
    handler: createNotaController,
  });

  // Get all Alunos Without Notas
  server.withTypeProvider<ZodTypeProvider>().get('/alunos/sem-notas', {
    schema: getAlunosWithoutNotaSchema,
    handler: getAlunosWithoutNotaController,
  });
};
export default notaRoutes;
