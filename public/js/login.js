import axios from 'axios';
import { showAlert } from './alerts.js';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/auth/login',
      data: {
        email,
        password,
      },
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response?.data?.message || 'Error logging in!');
  }
};

export const logOut = async () => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/auth/logout',
    });
    if (result.data.status === 'success') {
      location.assign('/login');
    }
  } catch (error) {
    console.error(error);
    showAlert('error', 'Error logging out! Try again.');
  }
};
