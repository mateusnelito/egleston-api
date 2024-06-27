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
        title: 'Egleston-API',
        description: 'CRUD API para um SGE.',
        version: '1.0.0',
      },
      tags: [
        { name: 'alunos', description: 'Endpoints relacionados a alunos' },
        {
          name: 'parentescos',
          description: 'Endpoints relacionados a parentesco',
        },
        {
          name: 'responsaveis',
          description: 'Endpoints relacionados a responsaveis',
        },
        {
          name: 'professores',
          description: 'Endpoints relacionados a professores',
        },
        {
          name: 'cursos',
          description: 'Endpoints relacionados a cursos',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  server.register(fastifySwaggerUi, {
    prefix: '/swagger',
  });
}
export default fastifyPlugin(swaggerDocs);
