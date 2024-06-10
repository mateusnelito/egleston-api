import fastify from 'fastify';

// Instantiate the server
const server = fastify();

// Route to test the server status (health)
server.get('/healthcheck', async (req, res) => {
  res.send({
    message: 'API Working...',
  });
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
