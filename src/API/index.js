import axios from 'axios';

// const API = axios.create({ baseURL: 'https://roots-server.fly.dev' });
const API = axios.create({ baseURL: 'http://localhost:3000' });


export const fetchCompanies = () => API.get('/companies');
export const fetchCompanysBySearch = (searchQuery) => API.get('/companies/search', { params: { searchQuery } });
export const register = (formData) => API.post('/auth/register', formData);
export const verifyEmail = (formData) => API.post('/auth/verify-email', formData);
export const login = (formData) => API.post('/auth/login', formData);
export const googleLogin = (tokenId) =>API.post('/auth/google-login', { tokenId });
export const requestPasswordReset = (email) => API.post('/users/request-password-reset', { email });
export const submitNewPassword = (token, newPassword) => API.post('/users/submit-new-password', { token, newPassword });
  