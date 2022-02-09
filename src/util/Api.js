import 'dotenv/config';
import axios from 'axios';

const { PROVIDER_URL } = process.env;

const api = axios.create({
  baseURL: PROVIDER_URL,
});

export default api;
