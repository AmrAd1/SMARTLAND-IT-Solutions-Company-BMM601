// Duplicate the marquee items so its animation loops without a gap.
const marqueeTrack = document.querySelector('.track');
if (marqueeTrack) {
  marqueeTrack.insertAdjacentHTML('beforeend', marqueeTrack.innerHTML);
}

// Swipe or use the arrows to move through all five images and wrap around.
document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const track = gallery.querySelector('.gallery-track');
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  const count = gallery.parentElement.querySelector('.gallery-count');
  let active = 0;
  let startX = null;

  const showSlide = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
    count.textContent = `${active + 1} / ${slides.length}`;
  };

  gallery.querySelector('.previous').addEventListener('click', () => showSlide(active - 1));
  gallery.querySelector('.next').addEventListener('click', () => showSlide(active + 1));
  track.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 40) showSlide(active + (distance < 0 ? 1 : -1));
    startX = null;
  });
  track.addEventListener('pointercancel', () => { startX = null; });
});

// Open a project's video dialog and start playback from the row click.
document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.open);
    if (!dialog) return;

    dialog.showModal();
    const video = dialog.querySelector('.project-video');
    if (video) video.play().catch(() => {});
  });
});

// Close on backdrop clicks, then stop and reset the project video.
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    const projectVideo = dialog.querySelector('.project-video');
    if (!projectVideo) return;

    projectVideo.pause();
    projectVideo.currentTime = 0;
  });
});
