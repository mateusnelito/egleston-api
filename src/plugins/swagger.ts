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
        {
          name: 'disciplinas',
          description: 'Endpoints relacionados a disciplinas',
        },
        {
          name: 'ano-lectivo',
          description: 'Endpoints relacionados a anos lectivos',
        },
        {
          name: 'classes',
          description: 'Endpoints relacionados a classes',
        },
        {
          name: 'salas',
          description: 'Endpoints relacionados a salas',
        },
        {
          name: 'turnos',
          description: 'Endpoints relacionados a turnos',
        },
        {
          name: 'turmas',
          description: 'Endpoints relacionados a turmas',
        },
        {
          name: 'matriculas',
          description: 'Endpoints relacionados a matriculas',
        },
        {
          name: 'metodos-pagamento',
          description: 'Endpoints relacionados a metodos de pagamentos',
        },
        {
          name: 'trimestres',
          description: 'Endpoints relacionados a trimestres',
        },
        {
          name: 'notas',
          description: 'Endpoints relacionados a notas',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  server.register(fastifySwaggerUi, {
    prefix: '/docs',
  });
}
export default fastifyPlugin(swaggerDocs);
