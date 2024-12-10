import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL });


// Assuming the token is stored in localStorage
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('userToken'); // Replace with your storage mechanism
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Shop-related API calls
export const fetchShops = () => API.get('/shops');
export const fetchShopsBySearch = (searchQuery) => API.get('/shops/search', { params: { searchQuery } });
export const likeShop = (shopId) => API.post('/users/like-shop', { shopId });
export const fetchLikedShops = () => API.get('/users/liked-shops');

// Authentication-related API calls
export const register = (formData) => API.post('/auth/register', formData);
export const verifyEmail = (formData) => API.post('/auth/verify-email', formData);
export const login = (formData) => API.post('/auth/login', formData);
export const googleLogin = (tokenId, parentId) => API.post('/auth/google-login', { tokenId, parentId });

// User-related API calls
export const requestPasswordReset = (email) => API.post('/users/request-password-reset', { email });
export const submitNewPassword = (token, newPassword) => API.post('/users/submit-new-password', { token, newPassword });

// Wallet-related API calls
export const fetchWallet = () => API.get("/wallet");
export const updateWallet = (walletData) => API.put("/wallet", walletData);

// Transactions-related API calls
export const fetchTransactions = () => API.get("/wallet/transactions");
export const fetchTransactionsByPage = (page = 1, limit = 10) => API.get('/wallet/transactions-by-page', { params: { page, limit } });
export const addTransaction = (transactionData) => API.post("/wallet/transactions", transactionData);

// Fetch user profile with family tree
export const fetchUserProfile = () => API.get('/users/profile');

// **Add the simulatePurchase function here**
export const simulatePurchase = (shopId) => API.post('/wallet/purchase', { shopId });