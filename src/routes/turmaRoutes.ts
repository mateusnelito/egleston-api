import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createTurmaController,
  getTurmaAlunosController,
  getTurmaController,
  getTurmaProfessoresController,
  updateTurmaController,
} from '../controllers/turmaControllers';
import {
  createTurmaSchema,
  getTurmaAlunosSchema,
  getTurmaProfessoresSchema,
  getTurmaSchema,
  updateTurmaSchema,
} from '../schemas/turmaSchemas';

export const turmaRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createTurmaSchema,
    handler: createTurmaController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:turmaId', {
    schema: updateTurmaSchema,
    handler: updateTurmaController,
  });

  // GET Turma
  server.withTypeProvider<ZodTypeProvider>().get('/:turmaId', {
    schema: getTurmaSchema,
    handler: getTurmaController,
  });

  // GET Turma Professores
  server.withTypeProvider<ZodTypeProvider>().get('/:turmaId/professores', {
    schema: getTurmaProfessoresSchema,
    handler: getTurmaProfessoresController,
  });

  // GET Turma Alunos
  server.withTypeProvider<ZodTypeProvider>().get('/:turmaId/alunos', {
    schema: getTurmaAlunosSchema,
    handler: getTurmaAlunosController,
  });
};
