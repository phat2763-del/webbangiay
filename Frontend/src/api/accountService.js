import axiosClient from './axiosClient';

const accountService = {
  login(credentials) {
    return axiosClient.post('/api/accounts/login', credentials);
  },
  register(accountData) {
    return axiosClient.post('/api/accounts/register', accountData);
  }
};

export default accountService;