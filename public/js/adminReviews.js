import axios from 'axios';
import { showAlert } from './alerts.js';
import { openModal, closeModal } from './modal.js';

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const initAdminReviews = () => {
  const form = document.getElementById('admin-review-form');
  if (!form) return;

  const idInput = document.getElementById('admin-review-id');
  const ratingSelect = document.getElementById('admin-review-rating');
  const reviewInput = document.getElementById('admin-review-text');
  const deleteNameEl = document.getElementById('confirm-delete-name');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  let pendingDeleteId = null;

  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.js-edit-review');
    if (editBtn) {
      const rev = JSON.parse(editBtn.dataset.review || '{}');
      idInput.value = rev._id || '';
      ratingSelect.value = String(rev.rating || 5);
      reviewInput.value = rev.review || '';
      openModal('modal-admin-review');
      return;
    }

    const deleteBtn = e.target.closest('.js-delete-review');
    if (deleteBtn) {
      pendingDeleteId = deleteBtn.dataset.id;
      if (deleteNameEl) {
        deleteNameEl.textContent = deleteBtn.dataset.name || 'this review';
      }
      openModal('modal-confirm-delete');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const reviewId = idInput.value.trim();
    if (!reviewId) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await axios.patch(`/api/v1/reviews/${reviewId}`, {
        rating: Number(ratingSelect.value),
        review: reviewInput.value.trim(),
      });
      closeModal('modal-admin-review');
      showAlert('success', 'Review updated successfully.');
      window.setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showAlert('error', getErrorMessage(err, 'Failed to update review.'));
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      confirmDeleteBtn.disabled = true;
      try {
        await axios.delete(`/api/v1/reviews/${pendingDeleteId}`);
        closeModal('modal-confirm-delete');
        showAlert('success', 'Review deleted successfully.');
        window.setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        showAlert('error', getErrorMessage(err, 'Failed to delete review.'));
        confirmDeleteBtn.disabled = false;
      }
    });
  }
};
