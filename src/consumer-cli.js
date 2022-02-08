import 'dotenv/config';
import ioClient from 'socket.io-client';

const socket = ioClient.connect(process.env.HOST_URL);

async function mainLoop() {}

await mainLoop();
