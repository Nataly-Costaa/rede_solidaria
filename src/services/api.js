import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const login = (email, senha) => api.post('/login', { email, senha });

// Usuários
export const getUsuarios = (params) => api.get('/usuarios', { params });
export const postUsuario = (data) => api.post('/usuarios', data);
export const putUsuario = (id, data) => api.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}`);

// Pontos de coleta
export const getPontos = () => api.get('/pontos');
export const postPonto = (data) => api.post('/pontos', data);

// Doações
export const getDoacoes = () => api.get('/doacoes');
export const postDoacao = (data) => api.post('/doacoes', data);

// Necessidades
export const getNecessidadesPorPonto = (id) => api.get(`/necessidades/${id}`);
export const postNecessidade = (data) => api.post('/necessidade', data);
