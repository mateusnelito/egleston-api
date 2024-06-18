import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import alunosRoutes from './alunoRoutes';
import parentescosRoutes from './parentescoRoutes';

// Create a plugin with all the routes as plugins
// Remember FastifyPlugin equals JS object
const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Define all the prefix routes
  server.register(alunosRoutes, { prefix: '/api/alunos' });
  server.register(parentescosRoutes, { prefix: '/api/parentescos' });
};
export default routes; // Export the all routes
