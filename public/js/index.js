import { login, logOut } from './login.js';
import { signup } from './signup.js';
import { updateSettings, initPasswordToggles } from './updateSettings.js';
import { initModals } from './modal.js';
import { initCatalog } from './catalog.js';
import { initTourDetail } from './tourDetail.js';
import { initMyBookings } from './myBookings.js';
import { initMyReviews } from './myReviews.js';
import { initBilling } from './billing.js';
import { initAdminTours } from './adminTours.js';
import { initAdminUsers } from './adminUsers.js';
import { initAdminReviews } from './adminReviews.js';
import { initAdminBookings } from './adminBookings.js';

// DOM elements
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logOut);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    const photoInput = document.getElementById('photo');
    if (photoInput && photoInput.files[0]) {
      form.append('photo', photoInput.files[0]);
    }
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.querySelector('.btn--save-password');
    if (saveBtn) saveBtn.textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
    if (saveBtn) saveBtn.textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.textContent = 'Processing...';
    const { tourId, stripeKey } = btn.dataset;
    const { bookTour } = await import('./stripe.js');
    bookTour(tourId, stripeKey);
  });
}

initModals();
initCatalog();
initTourDetail();
initMyBookings();
initMyReviews();
initBilling();
initPasswordToggles();
initAdminTours();
initAdminUsers();
initAdminReviews();
initAdminBookings();
