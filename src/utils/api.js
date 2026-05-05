import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ll_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Let the browser set Content-Type with correct multipart boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ll_token');
      localStorage.removeItem('ll_user');
    }
    return Promise.reject(err);
  }
);

export default api;
