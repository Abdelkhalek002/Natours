import axios from 'axios';
import { showAlert } from './alerts.js';

// type: 'password' || 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/me';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (error) {
    showAlert(
      'error',
      error.response?.data?.message || 'Error updating settings!',
    );
  }
};

export const initPasswordToggles = () => {
  const toggleButtons = document.querySelectorAll('[data-toggle-password]');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.togglePassword;
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = isPassword ? 'visibility_off' : 'visibility';
      }
      btn.setAttribute(
        'aria-label',
        isPassword ? 'Hide password' : 'Show password',
      );
    });
  });

  const photoInput = document.getElementById('photo');
  const photoName = document.getElementById('photo-filename');
  const avatarPreview = document.querySelector('.file-upload__avatar');
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      if (photoName) {
        photoName.textContent = file.name;
      }
      if (avatarPreview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            avatarPreview.src = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
};
