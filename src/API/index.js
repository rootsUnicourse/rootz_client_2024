import axios from 'axios';

// const API = axios.create({ baseURL: 'https://roots-server.fly.dev' });
const API = axios.create({ baseURL: 'http://localhost:4000' });


export const fetchUsers = () => API.get('/user');
export const fetchUserById = (data) => API.get(`/user/byid`,data);
export const getChildren = (email) => API.get(`/user/children?email=${email}`);
export const getGrandchildren = (emails) => API.get(`/user/grandchildren?first=${emails.first}&second=${emails.second}`);
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const googleLogin = (googleData) => API.post('/user/googleLogin', googleData);
export const facebookLogin = (facebookData) => API.post('/user/facebookLogin', facebookData);
export const fetchCompanys = () => API.get('/companys')
export const createCompany = (newCompany) => API.post('/companys', newCompany);
export const fetchCompanysBySearch = (searchQuery) =>
    API.get('/companys/search', { params: { searchQuery } });
export const checkBox = (isChecked) => API.post('/checkbox-clicked' ,isChecked);
export const sendMail = (mailData) => API.post('/mail', mailData);
export const updateUser = (formData) => API.put('/user/update',formData);
export const getAllDescendants = (email) => API.get(`/user/descendants?email=${email}`);
export const getUserByEmail = (email) => API.get(`/user/user-by-email?email=${email}`);
export const getInviteLimit = (userId) => API.get(`/user/inviteLimit/${userId}`);
export const updateInviteLimit = (userId, newLimit) => API.put(`/user/updateInviteLimit/${userId}`, {inviteLimit: newLimit});