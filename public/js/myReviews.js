import axios from 'axios';
import { showAlert } from './alerts.js';
import { openModal, closeModal } from './modal.js';

export const initMyReviews = () => {
  const reviewForm = document.getElementById('form-review');
  const modalTitle = document.getElementById('modal-review-title');
  const submitBtn = document.getElementById('btn-submit-review');
  const reviewIdInput = document.getElementById('review-id');
  const tourGroup = document.getElementById('review-tour-group');
  const tourSelect = document.getElementById('review-tour-select');
  const tourReadonly = document.getElementById('review-tour-readonly');
  const tourNameEl = document.getElementById('review-tour-name');
  const ratingInput = document.getElementById('review-rating');
  const reviewTextarea = document.getElementById('review-text');
  const starButtons = document.querySelectorAll('#review-star-picker .star-picker__btn');

  const confirmDeleteBtn = document.getElementById('btn-confirm-delete-review');
  const deleteMessageEl = document.getElementById('delete-review-message');
  let pendingDeleteId = null;

  const setRating = (value) => {
    const num = Math.min(5, Math.max(1, Number(value) || 5));
    if (ratingInput) ratingInput.value = String(num);

    starButtons.forEach((btn) => {
      const btnRating = Number(btn.dataset.rating);
      const isActive = btnRating <= num;
      btn.classList.toggle('is-active', isActive);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.classList.toggle('icon--filled', isActive);
      }
    });
  };

  starButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setRating(btn.dataset.rating);
    });
  });

  const openCreateBtn = document.getElementById('btn-open-create-review');
  if (openCreateBtn) {
    openCreateBtn.addEventListener('click', () => {
      if (reviewIdInput) reviewIdInput.value = '';
      if (modalTitle) modalTitle.textContent = 'Write Review';
      if (submitBtn) submitBtn.textContent = 'Publish Review';
      if (tourGroup) tourGroup.removeAttribute('hidden');
      if (tourReadonly) tourReadonly.setAttribute('hidden', '');
      if (reviewTextarea) reviewTextarea.value = '';
      setRating(5);
    });
  }

  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit-review');
    if (editBtn) {
      e.preventDefault();
      const { reviewId, tourName, rating, review } = editBtn.dataset;
      if (reviewIdInput) reviewIdInput.value = reviewId || '';
      if (modalTitle) modalTitle.textContent = 'Edit Review';
      if (submitBtn) submitBtn.textContent = 'Save Changes';
      if (tourGroup) tourGroup.setAttribute('hidden', '');
      if (tourReadonly) tourReadonly.removeAttribute('hidden');
      if (tourNameEl) tourNameEl.textContent = tourName || 'Expedition';
      if (reviewTextarea) reviewTextarea.value = review || '';
      setRating(rating || 5);
      openModal('modal-review-form');
      return;
    }

    const deleteBtn = e.target.closest('.btn-delete-review');
    if (deleteBtn) {
      e.preventDefault();
      pendingDeleteId = deleteBtn.dataset.reviewId || null;
      const tourName = deleteBtn.dataset.tourName;
      if (deleteMessageEl) {
        deleteMessageEl.textContent = tourName
          ? `Are you sure you want to delete your review for "${tourName}"? This action cannot be undone.`
          : 'Are you sure you want to delete this review? This action cannot be undone.';
      }
      openModal('modal-confirm-delete');
    }
  });

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const reviewId = reviewIdInput ? reviewIdInput.value.trim() : '';
      const rating = Number(ratingInput ? ratingInput.value : 5);
      const review = reviewTextarea ? reviewTextarea.value.trim() : '';

      if (!review) {
        showAlert('error', 'Please enter your review text.');
        return;
      }

      try {
        if (submitBtn) submitBtn.disabled = true;

        if (reviewId) {
          await axios({
            method: 'PATCH',
            url: `/api/v1/reviews/${reviewId}`,
            data: { rating, review },
          });
          showAlert('success', 'Review updated successfully!');
        } else {
          const tourId = tourSelect ? tourSelect.value : '';
          if (!tourId) {
            showAlert('error', 'Please select an expedition to review.');
            return;
          }
          await axios({
            method: 'POST',
            url: `/api/v1/tours/${tourId}/reviews`,
            data: { rating, review },
          });
          showAlert('success', 'Review published successfully!');
        }

        closeModal('modal-review-form');
        window.setTimeout(() => window.location.reload(), 600);
      } catch (error) {
        showAlert(
          'error',
          error.response?.data?.message || 'Could not save review.',
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      try {
        confirmDeleteBtn.disabled = true;
        await axios({
          method: 'DELETE',
          url: `/api/v1/reviews/${pendingDeleteId}`,
        });
        showAlert('success', 'Review deleted successfully!');
        closeModal('modal-confirm-delete');
        window.setTimeout(() => window.location.reload(), 600);
      } catch (error) {
        showAlert(
          'error',
          error.response?.data?.message || 'Could not delete review.',
        );
      } finally {
        confirmDeleteBtn.disabled = false;
      }
    });
  }
};
