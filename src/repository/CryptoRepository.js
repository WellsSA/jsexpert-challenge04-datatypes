import api from '../util/Api.js';

class CryptoRepository {
  async list(page = 1, limit = 5) {
    return api.get('/crypto', {
      params: {
        _page: page, // note: pagination could also use _start instead
        _limit: limit,
      },
    });
  }
}

export default CryptoRepository;
