document.addEventListener('DOMContentLoaded', () => {
  // ========== UTILITY FUNCTIONS ========== //

  /**
   * Lazy fade-in animation on elements matching selector,
   * triggered when element is about threshold visible in viewport.
   * @param {string} selector - CSS selector for elements to observe
   * @param {string} visibleClass - Class added when visible (default 'visible')
   * @param {number} threshold - Intersection threshold (default 0.13)
   */
  const lazyFadeIn = (selector, visibleClass = 'visible', threshold = 0.13) => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          observerInstance.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, { threshold });

    elements.forEach(el => observer.observe(el));
  };

  /**
   * Stagger fade-in with slide-up effect on child elements inside a parent,
   * triggered when the parent becomes visible in viewport.
   * @param {string} parentSelector - CSS selector for parent element
   * @param {string} childSelector - CSS selector for child elements
   * @param {string} visibleClass - Class to add on children (default 'visible')
   * @param {number} delay - Delay between child animations in ms (default 350)
   * @param {number} threshold - Intersection threshold (default 0.1)
   */
  const staggerFadeInSlideUp = (
    parentSelector,
    childSelector,
    visibleClass = 'visible',
    delay = 350,
    threshold = 0.1
  ) => {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    const children = parent.querySelectorAll(childSelector);
    if (!children.length) return;

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, index) => {
            setTimeout(() => child.classList.add(visibleClass), index * delay);
          });
          observerInstance.unobserve(entry.target); // Stop observing after animation triggered
        }
      });
    }, { threshold });

    observer.observe(parent);
  };

  // ========== PAGE COMPONENTS ========== //

  // 1. Navbar scroll effect: add 'scrolled' class when page is scrolled more than 10px
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // 2. Lazy load fade-in for content elements (fade with scroll)
  lazyFadeIn('.content', 'visible', 0.1);

  // 3. Staggered fade-in slide-up animation for contact cards inside '.contact-section'
  staggerFadeInSlideUp('.contact-section', '.contact-card', 'visible', 400, 0.13);

  // 4. Animate "Why NYPSU" section benefits and dividers with staggered animation on scroll
  const whySection = document.getElementById('why-nypsu');
  if (whySection) {
    const benefitItems = document.querySelectorAll('.benefit-item');
    const dividers = document.querySelectorAll('.divider');

    const whyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          benefitItems.forEach((item, idx) => {
            setTimeout(() => item.classList.add('animate'), idx * 200);
          });
          dividers.forEach((divider, idx) => {
            setTimeout(() => divider.classList.add('animate'), idx * 200 + 100);
          });
          whyObserver.unobserve(entry.target); // Stop observing after animation
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    whyObserver.observe(whySection);
  }

  // 5. Video controls for hero video playback and mute
  const heroVideo = document.getElementById('heroVideo');
  const videoToggle = document.getElementById('videoToggle');
  const muteBtn = document.getElementById('muteBtn');

  if (heroVideo && videoToggle) {
    // Initialize video paused state and toggle button text/icon
    heroVideo.pause();
    videoToggle.innerHTML = '<i class="fas fa-play"></i> Play Video';

    // Play/pause toggle on button click
    const showPlay = () => { videoToggle.innerHTML = '<i class="fas fa-play"></i> Play Video'; };
    const showPause = () => { videoToggle.innerHTML = '<i class="fas fa-pause"></i> Pause Video'; };

    videoToggle.addEventListener('click', () => {
      if (heroVideo.paused) {
        const played = heroVideo.play();
        if (played && typeof played.catch === 'function') played.catch(showPlay);
        showPause();
      } else {
        heroVideo.pause();
        showPlay();
      }
    });

    // Keep the label honest if playback stops for any other reason.
    heroVideo.addEventListener('play', showPause);
    heroVideo.addEventListener('pause', showPlay);

    // Auto-pause video and update toggle on mobile devices (width < 768px)
    if (window.innerWidth < 768) {
      heroVideo.pause();
      videoToggle.innerHTML = '<i class="fas fa-play"></i> Play Video';
    }
  }

  if (heroVideo && muteBtn) {
    // Toggle mute/unmute and update mute button text
    muteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      muteBtn.textContent = heroVideo.muted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', heroVideo.muted ? 'Unmute video' : 'Mute video');
      muteBtn.setAttribute('aria-pressed', String(heroVideo.muted));
    });
  }

  // 6. Headline ticker: duplicate ticker content until 3x width of parent for seamless scrolling
  const ticker = document.querySelector('.headline-content');
  if (ticker && ticker.parentElement) {
    const parentWidth = ticker.parentElement.offsetWidth;
    let tickerWidth = ticker.offsetWidth;
    const MAX_DOUBLINGS = 6; // 2^6 = 64x the original content is plenty

    for (let i = 0; i < MAX_DOUBLINGS && tickerWidth > 0 && tickerWidth < parentWidth * 3; i++) {
      ticker.innerHTML += ticker.innerHTML; // Duplicate content
      const grown = ticker.offsetWidth;
      if (grown <= tickerWidth) break; // Not growing - stop rather than spin forever
      tickerWidth = grown;
    }
  }
});