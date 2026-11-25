// Type is 'success' or 'error'

let hideTimeout;

export const hideAlert = () => {
  if (hideTimeout) {
    window.clearTimeout(hideTimeout);
    hideTimeout = undefined;
  }
  const el =
    document.getElementById('toast-banner') || document.querySelector('.alert');
  if (el && el.parentElement) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, msg) => {
  hideAlert();

  const variant = type === 'success' ? 'success' : 'error';
  const iconName = variant === 'success' ? 'check_circle' : 'error';

  const toast = document.createElement('div');
  toast.id = 'toast-banner';
  toast.className = `toast toast--${variant} alert alert--${variant}`;
  toast.setAttribute('role', 'status');

  const icon = document.createElement('span');
  icon.className = 'material-symbols-outlined toast__icon';
  icon.textContent = iconName;

  const message = document.createElement('span');
  message.className = 'toast__message';
  message.textContent = msg;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'toast__close';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.addEventListener('click', hideAlert);

  const closeIcon = document.createElement('span');
  closeIcon.className = 'material-symbols-outlined';
  closeIcon.textContent = 'close';
  closeBtn.appendChild(closeIcon);

  toast.appendChild(icon);
  toast.appendChild(message);
  toast.appendChild(closeBtn);

  const region = document.getElementById('toast-region') || document.body;
  region.appendChild(toast);

  hideTimeout = window.setTimeout(hideAlert, 5000);
};
