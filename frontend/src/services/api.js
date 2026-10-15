import axios from 'axios';


const apiHost = typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
const defaultBaseURL = `http://${apiHost}:1001`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || defaultBaseURL,
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

// Wishlist service functions
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

// Cart service functions
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};
export const getCartApi = getCart;

export const addToCart = async (productId) => {
  const response = await api.post(`/cart/${productId}`);
  return response.data;
};
export const addToCartApi = addToCart;

export const updateCartQty = async (productId, quantity) => {
  const response = await api.patch(`/cart/${productId}`, { quantity });
  return response.data;
};
export const updateCartQtyApi = updateCartQty;

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};
export const removeFromCartApi = removeFromCart;

// Order & Payment service functions
export const createPaymentOrder = async (shippingAddress) => {
  const response = await api.post('/orders/create-payment-order', { shippingAddress });
  return response.data;
};
export const createPaymentOrderApi = createPaymentOrder;

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/orders/verify-payment', paymentData);
  return response.data;
};
export const verifyPaymentApi = verifyPayment;

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};
export const getOrdersApi = getOrders;

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
export const getOrderByIdApi = getOrderById;

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};
export const updateOrderStatusApi = updateOrderStatus;

export default api;
