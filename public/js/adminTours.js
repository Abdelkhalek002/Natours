import axios from 'axios';
import { showAlert } from './alerts.js';
import { openModal, closeModal } from './modal.js';

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const initAdminTours = () => {
  const form = document.getElementById('admin-tour-form');
  if (!form) return;

  const modalTitle = document.getElementById('tour-modal-title');
  const idInput = document.getElementById('tour-id');
  const nameInput = document.getElementById('tour-name');
  const durationInput = document.getElementById('tour-duration');
  const maxGroupInput = document.getElementById('tour-max-group');
  const difficultySelect = document.getElementById('tour-difficulty');
  const priceInput = document.getElementById('tour-price');
  const summaryInput = document.getElementById('tour-summary');
  const descriptionInput = document.getElementById('tour-description');
  const startLocationInput = document.getElementById('tour-start-location');
  const guidesSelect = document.getElementById('tour-guides');
  const startDatesInput = document.getElementById('tour-start-dates');
  const imageCoverInput = document.getElementById('tour-image-cover');
  const imagesInput = document.getElementById('tour-images');
  const submitBtn = document.getElementById('tour-submit-btn');

  const deleteNameEl = document.getElementById('confirm-delete-name');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  let pendingDeleteId = null;

  const resetForm = () => {
    form.reset();
    idInput.value = '';
    Array.from(guidesSelect.options).forEach((opt) => {
      opt.selected = false;
    });
    modalTitle.textContent = 'Create Tour';
  };

  const newBtn = document.getElementById('btn-new-tour');
  if (newBtn) {
    newBtn.addEventListener('click', resetForm);
  }

  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.js-edit-tour');
    if (editBtn) {
      const tour = JSON.parse(editBtn.dataset.tour || '{}');
      idInput.value = tour._id || '';
      nameInput.value = tour.name || '';
      durationInput.value = tour.duration ?? '';
      maxGroupInput.value = tour.maxGroupSize ?? '';
      difficultySelect.value = tour.difficulty || 'easy';
      priceInput.value = tour.price ?? '';
      summaryInput.value = tour.summary || '';
      descriptionInput.value = tour.description || '';
      startLocationInput.value = tour.startLocationDescription || '';
      startDatesInput.value = tour.startDates || '';
      imageCoverInput.value = '';
      imagesInput.value = '';

      const selectedGuides = new Set(tour.guides || []);
      Array.from(guidesSelect.options).forEach((opt) => {
        opt.selected = selectedGuides.has(opt.value);
      });

      modalTitle.textContent = 'Edit Tour';
      openModal('modal-tour-form');
      return;
    }

    const deleteBtn = e.target.closest('.js-delete-tour');
    if (deleteBtn) {
      pendingDeleteId = deleteBtn.dataset.id;
      if (deleteNameEl) {
        deleteNameEl.textContent = deleteBtn.dataset.name || 'this tour';
      }
      openModal('modal-confirm-delete');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tourId = idInput.value.trim();
    const isEdit = Boolean(tourId);

    const guides = Array.from(guidesSelect.selectedOptions).map(
      (opt) => opt.value,
    );
    const startDates = startDatesInput.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const coverFile = imageCoverInput.files[0];
    const galleryFiles = Array.from(imagesInput.files || []);

    const jsonPayload = {
      name: nameInput.value.trim(),
      duration: Number(durationInput.value),
      maxGroupSize: Number(maxGroupInput.value),
      difficulty: difficultySelect.value,
      price: Number(priceInput.value),
      summary: summaryInput.value.trim(),
      description: descriptionInput.value.trim(),
      guides,
      startDates,
    };

    if (startLocationInput.value.trim()) {
      jsonPayload.startLocation = {
        description: startLocationInput.value.trim(),
      };
    }

    if (!isEdit) {
      jsonPayload.imageCover = 'tour-1-cover.jpg';
    }

    submitBtn.disabled = true;
    try {
      let targetId = tourId;

      if (isEdit && coverFile && galleryFiles.length > 0) {
        const formData = new FormData();
        formData.append('name', jsonPayload.name);
        formData.append('duration', String(jsonPayload.duration));
        formData.append('maxGroupSize', String(jsonPayload.maxGroupSize));
        formData.append('difficulty', jsonPayload.difficulty);
        formData.append('price', String(jsonPayload.price));
        formData.append('summary', jsonPayload.summary);
        formData.append('description', jsonPayload.description);
        guides.forEach((g) => formData.append('guides', g));
        startDates.forEach((d) => formData.append('startDates', d));
        if (jsonPayload.startLocation) {
          formData.append(
            'startLocation[description]',
            jsonPayload.startLocation.description,
          );
        }
        formData.append('imageCover', coverFile);
        galleryFiles.slice(0, 3).forEach((f) => formData.append('images', f));

        await axios.patch(`/api/v1/tours/${tourId}`, formData);
      } else if (isEdit) {
        await axios.patch(`/api/v1/tours/${tourId}`, jsonPayload);
      } else {
        const res = await axios.post('/api/v1/tours', jsonPayload);
        targetId = res.data?.data?.data?._id;
        if (targetId && coverFile && galleryFiles.length > 0) {
          const imgData = new FormData();
          imgData.append('imageCover', coverFile);
          galleryFiles.slice(0, 3).forEach((f) => imgData.append('images', f));
          await axios.patch(`/api/v1/tours/${targetId}`, imgData);
        }
      }

      closeModal('modal-tour-form');
      showAlert(
        'success',
        isEdit ? 'Tour updated successfully.' : 'Tour created successfully.',
      );
      window.setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showAlert('error', getErrorMessage(err, 'Failed to save tour.'));
      submitBtn.disabled = false;
    }
  });

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      confirmDeleteBtn.disabled = true;
      try {
        await axios.delete(`/api/v1/tours/${pendingDeleteId}`);
        closeModal('modal-confirm-delete');
        showAlert('success', 'Tour deleted successfully.');
        window.setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        showAlert('error', getErrorMessage(err, 'Failed to delete tour.'));
        confirmDeleteBtn.disabled = false;
      }
    });
  }
};
