// Wait till the html is fully loaded before processing this code
document.addEventListener('DOMContentLoaded', () => {
    /* ============================
       Navbar Scroll Class Toggle
       Adds/removes 'scrolled' class based on scroll position
    ============================ */
    // When you scroll past 10px, it addes to the class .scrolled
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
      }
    });
  
    /* ============================
       Animate Counting Numbers
    ============================ */
    function animateCount(el, target, duration) {
      let start = 0;
      // a frame every 16ms
      const increment = target / (duration / 16);
      function update() {
        start += increment;
        if (start < target) {
          // round down
          el.textContent = Math.floor(start).toLocaleString();
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
      update();
    }
  
    /* ============================
       Count Impact Numbers On Scroll
       Animates number counting when section enters viewport
    ============================ */
    // tracks whether counting already happened with counted
    function countImpactNumbers() {
      const impactSection = document.querySelector('.impact-section');
      // if it doesnt exist stop running
      if (!impactSection) return;
      // checking
      const impactValues = impactSection.querySelectorAll('.impact-value');
      let counted = false;
  
      function onScroll() {
        const rect = impactSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (!counted && rect.top < windowHeight && rect.bottom > 0) {
          impactValues.forEach(span => {
            const targetStr = span.getAttribute('data-target');
            if (targetStr === "1000000") {
              span.textContent = "∞";
            } else {
              const target = Number(targetStr);
              if (!isNaN(target)) {
                animateCount(span, target, 2000);
              }
            }
          });
          counted = true;
          window.removeEventListener('scroll', onScroll);
        }
      }
  
      window.addEventListener('scroll', onScroll);
      onScroll(); // Trigger check in case already in view
    }
  
    countImpactNumbers();
  
    /* ============================
       IntersectionObserver for Featured Events Slide-In
    ============================ */
    const featuredEvents = document.querySelectorAll('.featured-event');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('slide-in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      featuredEvents.forEach(fe => observer.observe(fe));
    } else {
      featuredEvents.forEach(fe => fe.classList.add('slide-in'));
    }
  
    /* ============================
       Generic Function to Animate Cards On Scroll
       (e.g., Event Cards, Testimonial Cards)
    ============================ */
    function animateCards(selector) {
      const cards = document.querySelectorAll(selector);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        cards.forEach(card => observer.observe(card));
      } else {
        cards.forEach(card => card.classList.add('show'));
      }
    }
  
    animateCards('.event-card');

    // Reveal every testimonial once the section scrolls in: the off-screen slide's
    // cards would otherwise never intersect the viewport and stay invisible.
    const testimonialsSection = document.querySelector('.testimonials');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialsSection && 'IntersectionObserver' in window) {
      const testimonialObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            testimonialCards.forEach(card => card.classList.add('show'));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      testimonialObserver.observe(testimonialsSection);
    } else {
      testimonialCards.forEach(card => card.classList.add('show'));
    }
  
    /* ============================
       Lazy-load Past Events Table Rows
    ============================ */
    const pastEventRows = document.querySelectorAll('.past-events-table tbody tr');
    if ('IntersectionObserver' in window && pastEventRows.length) {
      const pastEventsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      pastEventRows.forEach(row => pastEventsObserver.observe(row));
    } else {
      pastEventRows.forEach(row => row.classList.add('show'));
    }
  
    /* ============================
       Testimonial Carousel Controls
    ============================ */
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const indicators = document.querySelectorAll('.indicator');
    const track = document.getElementById('carouselTrack');
    let currentSlide = 0;
    const totalSlides = indicators.length || 2; // fallback to 2 if no indicators
  
    function updateCarousel() {
      if (!track) return;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === currentSlide);
      });
      if (prevBtn) prevBtn.disabled = currentSlide === 0;
      if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
    }
  
    function nextSlide() {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
      }
    }
  
    function previousSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    }
  
    function goToSlide(slideIndex) {
      if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateCarousel();
      }
    }
  
    if (prevBtn) prevBtn.addEventListener('click', previousSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    indicators.forEach((indicator, i) => {
      indicator.addEventListener('click', () => goToSlide(i));
      // role="button" on a <span> does not get Enter/Space for free.
      indicator.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToSlide(i);
        }
      });
    });
  
    updateCarousel();
  
    /* ============================
       Touch Support for Testimonial Carousel
    ============================ */
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    let startX = null;
    let currentX = null;
    let isDragging = false;
  
    const fab = document.querySelector('.floating-action-button');
    if (fab) fab.addEventListener('click', scrollToEvents);

    if (testimonialCarousel) {
      testimonialCarousel.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        isDragging = true;
      });
  
      testimonialCarousel.addEventListener('touchmove', e => {
        if (!isDragging || startX === null) return;
        currentX = e.touches[0].clientX;
        e.preventDefault(); // prevent scrolling while swiping
      }, { passive: false });
  
      testimonialCarousel.addEventListener('touchend', () => {
        if (!isDragging || startX === null || currentX === null) return;
        const diffX = startX - currentX;
        const threshold = 50; // swipe threshold in pixels
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) nextSlide();
          else previousSlide();
        }
        startX = null;
        currentX = null;
        isDragging = false;
      });
    }
  });
  
  /* ============================
     Floating Action Button scroll to Events Section
  ============================ */
  function scrollToEvents() {
    const eventsSection = document.querySelector('.events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }  