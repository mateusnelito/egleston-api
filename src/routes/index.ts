import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import alunosRoutes from './alunoRoutes';

// Create a plugin with all the routes as plugins
// Remember FastifyPlugin equals JS object
const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Define the prefix "/alunos" refers to alunosRoutes plugin
  server.register(alunosRoutes, { prefix: '/alunos' });
};
export default routes; // Export the all routes
