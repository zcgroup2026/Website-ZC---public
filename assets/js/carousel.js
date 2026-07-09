/**
 * Hero carousel — auto-rotating image slider
 * Ceder Group style full-width carousel with progress indicator
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
  var INTERVAL = 5000;
  var progressBar = null;

  // Create progress bar inside active dot
  function updateProgressDot() {
    // Remove old progress bar
    if (progressBar) progressBar.remove();

    var activeDot = dots[current];
    progressBar = document.createElement('span');
    progressBar.className = 'hero-dot-progress';
    activeDot.appendChild(progressBar);

    // Animate width over INTERVAL
    progressBar.style.transition = 'none';
    progressBar.style.width = '0';
    requestAnimationFrame(function() {
      progressBar.style.transition = 'width ' + INTERVAL + 'ms linear';
      progressBar.style.width = '100%';
    });
  }

  function goTo(index) {
    if (index === current) return;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    updateProgressDot();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    updateProgressDot();
    intervalId = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    if (progressBar) { progressBar.style.width = '0'; }
  }

  if (prevBtn) prevBtn.addEventListener('click', function() { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { next(); startAuto(); });

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(this.dataset.index));
      startAuto();
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') { prev(); startAuto(); }
    if (e.key === 'ArrowRight') { next(); startAuto(); }
  });

  var touchStartX = 0;
  carousel.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carousel.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { if (diff > 0) next(); else prev(); startAuto(); }
  }, { passive: true });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  startAuto();
})();