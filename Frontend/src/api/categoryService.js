import axiosClient from './axiosClient';

const categoryService = {
  getAll() {
    return axiosClient.get('/api/categories');
  }
};

export default categoryService;