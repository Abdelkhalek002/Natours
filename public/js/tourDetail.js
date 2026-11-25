export const initTourDetail = () => {
  const track = document.getElementById('reviewTrack');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');

  if (!track) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -380, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 380, behavior: 'smooth' });
    });
  }
};
