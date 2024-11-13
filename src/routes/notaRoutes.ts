import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createBulkNotaController,
  createNotaController,
  getAlunosAbsentNotaController,
} from '../controllers/notaController';
import {
  createBulkNotaSchema,
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

  // Create Bulk Notas
  server.withTypeProvider<ZodTypeProvider>().post('/bulk', {
    schema: createBulkNotaSchema,
    handler: createBulkNotaController,
  });
};
export default notaRoutes;
