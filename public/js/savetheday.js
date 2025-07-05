// savetheday.js

document.addEventListener('DOMContentLoaded', () => {
  // Mostrar el video con fade-in
  const video = document.querySelector('.video-banner');
  if (video) {
    video.classList.add('show');
  }


  // Cuenta regresiva
  const targetDate = new Date('2025-12-15T15:00:00');
  const countdown = document.getElementById('countdown');

  if (countdown) {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        countdown.textContent = "¡Hoy es el gran día!";
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
  }

  // Slider de fotos
  const slides = document.querySelectorAll('.slider-container img');
  let index = 0;

  if (slides.length > 0) {
    slides[0].classList.add('active');
    setInterval(() => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, 5000);
  }
});
