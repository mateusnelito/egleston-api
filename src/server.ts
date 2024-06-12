import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import routes from './routes'; // Import all registered routes
import HttpStatusCodes from './utils/HttpStatusCodes';
import errorHandlerPlugin from './plugins/errorHandler';

// Instantiate the server
const server = fastify();
server.register(errorHandlerPlugin);

// Add zod-type-provider validator compiler and serializer compiler
// as default schema validator and serializer
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Route to test the server status (health)
server.get('/healthcheck', async (req, res) => {
  res.send({
    message: 'API Working...',
  });
});

server.register(routes); // Register all the routes to API

// Define the 404 route
server.setNotFoundHandler((request, reply) => {
  reply.code(HttpStatusCodes.NOT_FOUND).send({ message: 'Route not found' });
});

const SERVER_PORT = Number(process.env.SERVER_PORT || 8000);

// Initiate the server
server
  .listen({ port: SERVER_PORT })
  .then(() => {
    console.log(`🔥 API Running on :${SERVER_PORT}`);
  })
  .catch((err) => {
    console.error(`🛑 Error starting API: \n ${err}`);
    process.exit(1);
  });
