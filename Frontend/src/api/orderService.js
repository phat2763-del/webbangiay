import axiosClient from './axiosClient';

const orderService = {
  createOrder(orderData) {
    return axiosClient.post('/api/orders', orderData);
  }
};

export default orderService;