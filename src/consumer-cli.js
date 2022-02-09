import 'dotenv/config';
import ioClient from 'socket.io-client';
import CustomTerminal from './util/CustomTerminal.js';

const VOCABULARY = {
  STOP: ':q',
  SELECT: 'select',
  REMOVE: 'remove',
  UPDATE: '',
};

const socket = ioClient.connect(process.env.HOST_URL);
const terminal = new CustomTerminal();
let selectedCrypto = null;

terminal.initialize();

socket.on('selected', async data => {
  terminal.addDataToPrint([data.crypto]);
  selectedCrypto = data.crypto;
  terminal.printSuccess('New data available, [press Enter] to fetch');
});

async function mainLoop() {
  try {
    terminal.printSuccess(
      '---------------------------- \n' + 'Wallet | Connection Stablished'
    );

    if (selectedCrypto) {
      terminal.print(
        '---------------------------- \n' +
          `Percentage variation of ${selectedCrypto.symbol} (${selectedCrypto.name}): `
      );
      terminal.plotQuoteChart(selectedCrypto.quote.USD);
    }

    terminal.printInfo(
      '---------------------------- \n' +
        'Commands: \n' +
        '\t* [press Enter]: update your Wallet \n' +
        '\t* select <ID>: select the crypto according to the specified <ID> \n' +
        '\t* remove <ID>: remove the crypto according to the specified <ID> \n' +
        '\t* :q : finish the process. \n'
    );

    terminal.print('Current listing:');
    if (!terminal.hasDataToPrint()) {
      terminal.printError('\tNo items in your wallet yet.');
    } else {
      terminal.draftTable();
    }

    const answer = await terminal.readLine(
      'Insert the chosen command bellow: \n'
    );

    const [command] = answer.split(' ');
    switch (command) {
      case VOCABULARY.STOP:
        terminal.close();
        console.info('Terminal instance finished!');
        process.exit(0);
      case VOCABULARY.SELECT: {
        terminal.printSuccess('SELECTING REGISTER...');
        await terminal.wait(100);
        const [_, id] = answer.split(' ');

        const data = terminal.getDataById(+id);

        if (!data) {
          throw new RangeError(`No register found for id [${id || ' '}]`);
        }

        selectedCrypto = data;
        terminal.printSuccess('REGISTER SELECTED SUCCESSFULLY!');
        await terminal.wait(500);
        break;
      }
      case VOCABULARY.REMOVE: {
        terminal.printSuccess('REMOVING REGISTER FROM YOUR WALLET...');
        await terminal.wait(100);
        const [_, id] = answer.split(' ');

        const data = terminal.removeDataById(+id);

        if (!data) {
          throw new RangeError(`No register found for id [${id || ' '}]`);
        }
        selectedCrypto = null;
        terminal.printSuccess('REGISTER REMOVED SUCCESSFULLY!');
        await terminal.wait(1000);
        break;
      }
      case VOCABULARY.UPDATE:
        terminal.printSuccess('FETCHING...');
        await terminal.wait(1000);

        return mainLoop();
      default:
        terminal.printError('Unknown command. Check the syntax and try again.');
        break;
    }

    await terminal.wait(2000);
  } catch (error) {
    terminal.printError(`Error@mainLoop: ${error.message} \n`);
  }
  return mainLoop();
}

await mainLoop();
