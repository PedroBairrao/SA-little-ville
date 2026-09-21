import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Anexa o token JWT salvo em todas as requisições, quando existir.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirar/for invalido, desloga o morador automaticamente.
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response && erro.response.status === 401) {
      localStorage.removeItem('lv_token');
      localStorage.removeItem('lv_usuario');
    }
    return Promise.reject(erro);
  },
);

export default api;
