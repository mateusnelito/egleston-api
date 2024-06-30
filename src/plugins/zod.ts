import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

async function zodTypeProvider(server: FastifyInstance) {
  // Add zod-type-provider validator compiler and serializer compiler
  // as default schema validator and serializer
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);
}
export default fastifyPlugin(zodTypeProvider);
