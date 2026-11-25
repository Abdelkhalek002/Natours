import axios from 'axios';
import { showAlert } from './alerts.js';
import { openModal, closeModal } from './modal.js';

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const initAdminUsers = () => {
  const form = document.getElementById('admin-user-form');
  if (!form) return;

  const idInput = document.getElementById('user-id');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const roleSelect = document.getElementById('user-role');
  const activeSelect = document.getElementById('user-active');
  const deleteNameEl = document.getElementById('confirm-delete-name');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  let pendingDeleteId = null;

  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.js-edit-user');
    if (editBtn) {
      const user = JSON.parse(editBtn.dataset.user || '{}');
      idInput.value = user._id || '';
      nameInput.value = user.name || '';
      emailInput.value = user.email || '';
      roleSelect.value = user.role || 'user';
      activeSelect.value = user.active === false ? 'false' : 'true';
      openModal('modal-user-form');
      return;
    }

    const deleteBtn = e.target.closest('.js-delete-user');
    if (deleteBtn) {
      pendingDeleteId = deleteBtn.dataset.id;
      if (deleteNameEl) {
        deleteNameEl.textContent = deleteBtn.dataset.name || 'this user';
      }
      openModal('modal-confirm-delete');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = idInput.value.trim();
    if (!userId) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await axios.patch(`/api/v1/users/${userId}`, {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        role: roleSelect.value,
        active: activeSelect.value === 'true',
      });
      closeModal('modal-user-form');
      showAlert('success', 'User updated successfully.');
      window.setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showAlert('error', getErrorMessage(err, 'Failed to update user.'));
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      confirmDeleteBtn.disabled = true;
      try {
        await axios.delete(`/api/v1/users/${pendingDeleteId}`);
        closeModal('modal-confirm-delete');
        showAlert('success', 'User deleted successfully.');
        window.setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        showAlert('error', getErrorMessage(err, 'Failed to delete user.'));
        confirmDeleteBtn.disabled = false;
      }
    });
  }
};
