import CustomTerminal from './util/CustomTerminal.js';
import CryptoService from './service/CryptoService.js';
import { io } from './producer-server.js';
import Users from './entity/Users.js';

const VOCABULARY = {
  STOP: ':q',
  LIST: '',
  SELECT: 'select',
};

const terminal = new CustomTerminal();
terminal.initialize();

const service = new CryptoService();
const cryptoGenerator = service.list();

const users = new Users();

io.on('connection', socket => {
  users.add({ id: socket.id });
  terminal.printSuccess(`Real time update: user [${socket.id}] connected!`);
});

async function mainLoop() {
  try {
    if (users.hasUsers()) {
      terminal.printSuccess(
        '---------------------------- \n' +
          'Connected Users: ' +
          Array.from(users).join(', ')
      );
    }
    terminal.printInfo(
      '---------------------------- \n' +
        'Commands: \n' +
        '\t* [press Enter]: list 5 more values \n' +
        '\t* select <ID>: select the crypto according to the specified <ID> \n' +
        '\t* :q : finish the process. \n'
    );
    if (!terminal.hasDataToPrint()) {
      const { value } = await cryptoGenerator.next();
      terminal.addDataToPrint(value);
    }

    terminal.print('Current listing:');
    terminal.draftTable();

    const answer = await terminal.readLine(
      'Insert the chosen command bellow: \n'
    );

    const [command] = answer.split(' ');
    switch (command) {
      case VOCABULARY.STOP:
        terminal.close();
        console.info('Terminal instance finished!');
        process.exit(0);
      case VOCABULARY.LIST:
        terminal.printSuccess('LISTING NEXT REGISTERS...');
        const { value } = await cryptoGenerator.next();
        terminal.addDataToPrint(value);
        break;
      case VOCABULARY.SELECT:
        terminal.printSuccess('SELECTING REGISTER...');
        await terminal.wait(100);
        const [_, id] = answer.split(' ');

        const data = terminal.getDataById(+id);

        if (!data) {
          throw new RangeError(`No register found for id [${id || ' '}]`);
        }
        io.emit('selected', {
          crypto: data,
        });
        terminal.printSuccess(
          'REGISTER SUCCESSFULLY SELECTED AND SENT TO THE FOLLOWING USERS: \n' +
            Array.from(users).join(', ') +
            '\n'
        );
        await terminal.wait(1000);
        break;
      default:
        terminal.printError('Unknown command. Check the syntax and try again.');
        break;
    }
  } catch (error) {
    terminal.printError(`Error@mainLoop: ${error.message} \n`);
  }
  return mainLoop();
}

export default mainLoop;
