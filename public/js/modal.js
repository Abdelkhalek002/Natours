export const openModal = (id) => {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add('is-open');
  modal.removeAttribute('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const focusable = modal.querySelector(
    'input:not([type="hidden"]), select, textarea, button:not([data-modal-close])',
  );
  if (focusable) focusable.focus();
};

export const closeModal = (id) => {
  const modal = id
    ? document.getElementById(id)
    : document.querySelector('.modal-backdrop.is-open');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  if (!document.querySelector('.modal-backdrop.is-open')) {
    document.body.classList.remove('modal-open');
  }
};

export const initModals = () => {
  document.addEventListener('click', (e) => {
    const openTrigger = e.target.closest('[data-modal-open]');
    if (openTrigger) {
      e.preventDefault();
      openModal(openTrigger.dataset.modalOpen);
      return;
    }

    const closeTrigger = e.target.closest('[data-modal-close]');
    if (closeTrigger) {
      e.preventDefault();
      const backdrop = closeTrigger.closest('.modal-backdrop');
      closeModal(closeTrigger.dataset.modalClose || (backdrop && backdrop.id));
      return;
    }

    if (e.target.classList.contains('modal-backdrop')) {
      closeModal(e.target.id);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
};
