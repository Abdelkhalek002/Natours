export const initMyBookings = () => {
  const tabButtons = document.querySelectorAll('[data-tab]');
  if (!tabButtons.length) return;

  const panels = {
    upcoming: document.getElementById('tab-upcoming'),
    past: document.getElementById('tab-past'),
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach((item) => {
        const isActive = item.dataset.tab === target;
        item.classList.toggle('chip--active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      Object.entries(panels).forEach(([key, panel]) => {
        if (!panel) return;
        if (key === target) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    });
  });
};
