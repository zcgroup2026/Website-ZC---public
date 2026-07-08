/**
 * Hero carousel — auto-rotating image slider
 * Ceder Group style full-width carousel
 */
(function() {
  'use strict';

  var carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  var slides = carousel.querySelectorAll('.hero-slide');
  var dots = carousel.querySelectorAll('.hero-dot');
  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');

  var current = 0;
  var total = slides.length;
  if (total === 0) return;

  var intervalId = null;
  var INTERVAL = 5000; // 5 seconds

  function goTo(index) {
    if (index === current) return;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    // Remove active from current
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    // Set new
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    intervalId = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', function() { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { next(); startAuto(); });

  // Dot clicks
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var idx = parseInt(this.dataset.index);
      goTo(idx);
      startAuto();
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') { prev(); startAuto(); }
    if (e.key === 'ArrowRight') { next(); startAuto(); }
  });

  // Touch swipe support
  var touchStartX = 0;
  var touchEndX = 0;
  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
      startAuto();
    }
  }, { passive: true });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Start
  startAuto();
})();
