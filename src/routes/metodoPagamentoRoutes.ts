import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createMetodoPagamentoController,
  getMetodoPagamentoController,
  getMetodosPagamentoController,
  updateMetodoPagamentoController,
} from '../controllers/metodoPagamentoControllers';
import {
  createMetodoPagamentoSchema,
  getMetodoPagamentoSchema,
  getMetodosPagamentoSchema,
  updateMetodoPagamentoSchema,
} from '../schemas/metodoPagamentoSchemas';

export const metodoPagamentoRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POSTS
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createMetodoPagamentoSchema,
    handler: createMetodoPagamentoController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:metodoPagamentoId', {
    schema: updateMetodoPagamentoSchema,
    handler: updateMetodoPagamentoController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/:metodoPagamentoId', {
    schema: getMetodoPagamentoSchema,
    handler: getMetodoPagamentoController,
  });

  // GET
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getMetodosPagamentoSchema,
    handler: getMetodosPagamentoController,
  });
};
