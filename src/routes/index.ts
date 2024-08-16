import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import alunosRoutes from './alunoRoutes';
import { anoLectivoRoutes } from './anoLectivoRoutes';
import { classeRoutes } from './classeRoutes';
import cursosRoutes from './cursoRoutes';
import disciplinaRoutes from './disciplinaRoutes';
import { matriculaRoutes } from './matriculaRoutes';
import parentescosRoutes from './parentescoRoutes';
import professoresRoutes from './professorRoutes';
import responsaveisRoutes from './responsavelRoutes';
import { salaRoutes } from './salaRoutes';
import { turmaRoutes } from './turmaRoutes';
import { turnoRoutes } from './turnoRoutes';

// Create a plugin with all the routes as plugins
// Remember FastifyPlugin equals JS object
const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Define all the prefix routes
  server.register(alunosRoutes, { prefix: '/api/alunos' });
  server.register(parentescosRoutes, { prefix: '/api/parentescos' });
  server.register(responsaveisRoutes, { prefix: '/api/responsaveis' });
  server.register(professoresRoutes, { prefix: '/api/professores' });
  server.register(cursosRoutes, { prefix: '/api/cursos' });
  server.register(disciplinaRoutes, { prefix: '/api/disciplinas' });
  server.register(anoLectivoRoutes, { prefix: '/api/ano-lectivos' });
  server.register(classeRoutes, { prefix: '/api/classes' });
  server.register(salaRoutes, { prefix: '/api/salas' });
  server.register(turnoRoutes, { prefix: '/api/turnos' });
  server.register(turmaRoutes, { prefix: '/api/turmas' });
  server.register(matriculaRoutes, { prefix: '/api/matriculas' });
};
export default routes; // Export the all routes
