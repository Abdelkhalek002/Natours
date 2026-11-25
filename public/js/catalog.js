const updateCatalogQuery = (updates) => {
  const url = new URL(window.location.href);

  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.location.assign(url.toString());
};

export const initCatalog = () => {
  const chips = document.querySelectorAll('.filter-chips .chip[data-difficulty]');
  const sortSelect = document.getElementById('catalog-sort');

  if (chips.length) {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const difficulty = chip.dataset.difficulty || '';
        updateCatalogQuery({ difficulty, page: '' });
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sort = e.target.value || '';
      updateCatalogQuery({ sort, page: '' });
    });
  }
};
