import chalk from 'chalk';

export default {
  table: {
    leftPad: 2,
    columns: [
      { field: 'id', name: chalk.green('ID') },
      { field: 'symbol', name: chalk.blueBright('Symbol') },
      { field: 'name', name: chalk.redBright('Name') },
      { field: 'cmc_rank', name: chalk.magenta('CMC Rank') },
      { field: 'total_supply', name: chalk.cyan('Total Supply') },
    ],
  },
};
