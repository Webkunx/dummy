const { fastify } = require("fastify");

const server = fastify();

server.route({
  method: ["GET", "POST", "PUT", "DELETE"],
  url: "/*",
  handler: async (request, reply) => {
    return {
      success: true,
      data: {
        url: request.url,
        method: request.method,
        body: request.body,
        headers: request.headers,
      },
    };
  },
});

module.exports = {
  startFastifyServer: () => {
    server.listen(process.env.PORT || 4000, async (err, address) => {
      console.log(`Server listening at ${address}`);
    });
  },
};
