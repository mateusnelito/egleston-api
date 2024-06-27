import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createDisciplinaSchema,
  getDisciplinaSchema,
  getDisciplinasSchema,
  updateDisciplinaSchema,
} from '../schemas/disciplinaSchema';
import { createDisciplina } from '../controllers/disciplinaController';

const disciplinaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createDisciplinaSchema,
    handler: createDisciplina,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:disciplinaId', {
    schema: updateDisciplinaSchema,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'PUT disciplina working...' });
    },
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:disciplinaId', {
    schema: getDisciplinaSchema,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'GET UNIQUE disciplina working...' });
    },
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: getDisciplinasSchema,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'GET UNIQUE disciplina working...' });
    },
  });
};

export default disciplinaRoutes;
