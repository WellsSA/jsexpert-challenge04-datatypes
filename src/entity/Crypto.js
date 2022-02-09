class Crypto {
  constructor({ id, name, symbol, total_supply, cmc_rank, quote }) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.total_supply = total_supply;
    this.cmc_rank = cmc_rank;
    this.quote = quote;
  }
}

export default Crypto;
