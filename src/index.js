import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { server } from './producer-server.js';
import mainLoop from './producer-cli.js';

const { DEFAULT_PORT } = process.env;

const { port } = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    type: 'number',
    default: DEFAULT_PORT,
    description: 'The websocket server port',
  })
  .parse();

server.listen(port, async () => {
  console.info('🚀 Producer server successfully started on port: ' + port);
  await mainLoop();
});
