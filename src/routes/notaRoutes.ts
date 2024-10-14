import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createNotaController,
  getAlunosAbsentNotaController,
} from '../controllers/notaController';
import {
  createNotaSchema,
  getAlunosAbsentNotaSchema,
} from '../schemas/notaSchema';

const notaRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createNotaSchema,
    handler: createNotaController,
  });

  // Get all Alunos Without Notas
  server.withTypeProvider<ZodTypeProvider>().get('/alunos/absent-nota', {
    schema: getAlunosAbsentNotaSchema,
    handler: getAlunosAbsentNotaController,
  });
};
export default notaRoutes;
