import axios from 'axios';
import { showAlert } from '../js/alerts.js';
export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfuly!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logOut = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout',
    });
    if (result.data.status === 'success') {
      location.assign('http://localhost:8000/login');
    }
  } catch (error) {
    console.log(error);
    showAlert('error', 'Error logging out! try again');
  }
};
