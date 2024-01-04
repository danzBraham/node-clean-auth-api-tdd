require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

const start = async () => {
  const server = await createServer(container);
  server.start();
  // eslint-disable-next-line no-console
  console.log(`The server runs on ${server.info.uri} ...`);
};

start();
