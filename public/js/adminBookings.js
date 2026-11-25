import axios from 'axios';
import { showAlert } from './alerts.js';
import { openModal, closeModal } from './modal.js';

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const initAdminBookings = () => {
  const form = document.getElementById('admin-booking-form');
  if (!form) return;

  const modalTitle = document.getElementById('booking-modal-title');
  const idInput = document.getElementById('booking-id');
  const tourSelect = document.getElementById('booking-tour');
  const userSelect = document.getElementById('booking-user');
  const priceInput = document.getElementById('booking-price');
  const paidSelect = document.getElementById('booking-paid');
  const submitBtn = document.getElementById('booking-submit-btn');

  const deleteNameEl = document.getElementById('confirm-delete-name');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  let pendingDeleteId = null;

  const resetForm = () => {
    form.reset();
    idInput.value = '';
    paidSelect.value = 'true';
    modalTitle.textContent = 'Create Booking';
  };

  const newBtn = document.getElementById('btn-new-booking');
  if (newBtn) {
    newBtn.addEventListener('click', resetForm);
  }

  tourSelect.addEventListener('change', () => {
    if (idInput.value) return;
    const selectedOpt = tourSelect.options[tourSelect.selectedIndex];
    if (selectedOpt && selectedOpt.dataset.price) {
      priceInput.value = selectedOpt.dataset.price;
    }
  });

  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.js-edit-booking');
    if (editBtn) {
      const booking = JSON.parse(editBtn.dataset.booking || '{}');
      idInput.value = booking._id || '';
      tourSelect.value = booking.tour || '';
      userSelect.value = booking.user || '';
      priceInput.value = booking.price ?? '';
      paidSelect.value = booking.paid ? 'true' : 'false';
      modalTitle.textContent = 'Edit Booking';
      openModal('modal-booking-form');
      return;
    }

    const deleteBtn = e.target.closest('.js-delete-booking');
    if (deleteBtn) {
      pendingDeleteId = deleteBtn.dataset.id;
      if (deleteNameEl) {
        deleteNameEl.textContent = deleteBtn.dataset.name || 'this booking';
      }
      openModal('modal-confirm-delete');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookingId = idInput.value.trim();
    const isEdit = Boolean(bookingId);

    const payload = {
      tour: tourSelect.value,
      user: userSelect.value,
      price: Number(priceInput.value),
      paid: paidSelect.value === 'true',
    };

    submitBtn.disabled = true;
    try {
      if (isEdit) {
        await axios.patch(`/api/v1/bookings/${bookingId}`, payload);
      } else {
        await axios.post('/api/v1/bookings', payload);
      }
      closeModal('modal-booking-form');
      showAlert(
        'success',
        isEdit
          ? 'Booking updated successfully.'
          : 'Booking created successfully.',
      );
      window.setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showAlert('error', getErrorMessage(err, 'Failed to save booking.'));
      submitBtn.disabled = false;
    }
  });

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      confirmDeleteBtn.disabled = true;
      try {
        await axios.delete(`/api/v1/bookings/${pendingDeleteId}`);
        closeModal('modal-confirm-delete');
        showAlert('success', 'Booking deleted successfully.');
        window.setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        showAlert('error', getErrorMessage(err, 'Failed to delete booking.'));
        confirmDeleteBtn.disabled = false;
      }
    });
  }
};
