import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createProfessorSchema } from '../schemas/professorSchemas';
import { createProfessor } from '../controllers/professorController';

const professoresRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/create', {
    schema: createProfessorSchema,
    handler: createProfessor,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:professorId', {
    schema: z.object({}),
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'working...' });
    },
  });

  // GET UNIQUE RESOURCE
  server.withTypeProvider<ZodTypeProvider>().get('/:professorId', {
    schema: z.object({}),
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'working...' });
    },
  });

  // GET ALL RESOURCES
  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: z.object({}),
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'working...' });
    },
  });
};

export default professoresRoutes;
