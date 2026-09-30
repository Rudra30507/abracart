import axios from 'axios';


const apiHost = typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';

const api = axios.create({
  baseURL: `http://${apiHost}:1001`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});


export const registerUser = async (customerData) => {
  const response = await api.post('/customers/register', customerData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/customers/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/customers/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/customers/logout');
  return response.data;
};

// Product service functions
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Wishlist service functions (Lab 04)
export const addToWishlist = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

export const toggleWishlistApi = async (productId) => {
  const response = await api.patch(`/wishlist/${productId}/toggle`);
  return response.data;
};

export default api;
