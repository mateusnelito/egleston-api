import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

// Set Swagger documentation
async function swaggerDocs(server: FastifyInstance) {
  server.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      produces: ['application/json'],
      info: {
        title: 'Egleston-SGE',
        description: 'CRUD API para um SGE.',
        version: '1.0.0',
      },
      tags: [
        { name: 'alunos', description: 'Endpoints relacionados a alunos' },
      ],
    },
    transform: jsonSchemaTransform,
  });

  server.register(fastifySwaggerUi, {
    prefix: '/docs',
  });
}
export default fastifyPlugin(swaggerDocs);
