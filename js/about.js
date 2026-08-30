document.addEventListener('DOMContentLoaded', () => {
  /* ================================
     Navbar Scroll Behavior
  ================================ */
  const navbar = document.querySelector('.navbar'); // Select navbar element
  if (navbar) {
    window.addEventListener('scroll', () => {
      // Toggle 'scrolled' class if scrolled beyond 10px vertically
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* ================================
     Infinite Loop Carousel Setup
  ================================ */
  const track = document.querySelector('.carousel-track');       // Carousel track container
  const prevBtn = document.querySelector('.prev-btn');            // Previous button
  const nextBtn = document.querySelector('.next-btn');            // Next button
  const items = document.querySelectorAll('.activity-item');       // Carousel items
  const itemCount = items.length;                                 // Number of original items

  // Bail out cleanly on a page without the activities carousel rather than throwing
  // on items[0] and taking every script below down with it.
  if (track && itemCount > 0) {
    // Clone first and last items for seamless infinite looping
    const firstItem = items[0].cloneNode(true);
    const lastItem = items[itemCount - 1].cloneNode(true);
    firstItem.classList.add('cloned'); // Mark clone for style or logic
    lastItem.classList.add('cloned');
    track.appendChild(firstItem);       // Append clone of first item to end
    track.insertBefore(lastItem, items[0]); // Insert clone of last item at start

    const allItems = document.querySelectorAll('.activity-item');  // Includes clones
    let currentIndex = 1;                                          // Start at first original item
    let isAnimating = false;                                       // Prevent overlapping anims
    let animationTimer;                                            // Failsafe for a missed transitionend
    let autoScrollInterval;                                        // Auto-scroll interval ID
    let touchStartX = 0;                                           // Touch start X pos
    let touchEndX = 0;                                             // Touch end X pos

    // Measure the real stride (width + horizontal margins). Those margins change at
    // the 900px and 576px breakpoints, so the hard-coded +20 drifted a little further
    // out of alignment with every slide on smaller screens.
    function getItemWidth() {
      const style = window.getComputedStyle(allItems[0]);
      return allItems[0].getBoundingClientRect().width
        + parseFloat(style.marginLeft || 0)
        + parseFloat(style.marginRight || 0);
    }

    let itemWidth = getItemWidth();

    // Initialize track position at first original item, no animation
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

    // Update carousel position, optionally animate transition
    function updateTrackPosition(index, animate = true) {
      track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
      track.style.transform = `translateX(-${index * itemWidth}px)`;
      isAnimating = animate;

      clearTimeout(animationTimer);
      if (animate) {
        // If transitionend never lands (reduced motion, backgrounded tab) don't leave
        // the carousel wedged behind the isAnimating guard forever.
        animationTimer = setTimeout(handleTransitionEnd, 700);
      }
    }

    // Handle end of CSS transition for infinite loop fixups
    function handleTransitionEnd(e) {
      // transitionend bubbles, and .activity-item transitions background-color on
      // hover - those events were landing here and cancelling a slide mid-flight.
      if (e && (e.target !== track || e.propertyName !== 'transform')) return;

      clearTimeout(animationTimer);
      isAnimating = false;

      // If at cloned last item (index 0), jump to real last
      if (currentIndex === 0) {
        currentIndex = itemCount;
        updateTrackPosition(currentIndex, false);
      }
      // If at cloned first item (index itemCount + 1), jump to real first
      else if (currentIndex === itemCount + 1) {
        currentIndex = 1;
        updateTrackPosition(currentIndex, false);
      }
    }

    // Move to previous slide
    function prevSlide() {
      if (isAnimating) return;
      stopAutoScroll();
      currentIndex--;
      updateTrackPosition(currentIndex);
      startAutoScroll();
    }

    // Move to next slide
    function nextSlide() {
      if (isAnimating) return;
      stopAutoScroll();
      currentIndex++;
      updateTrackPosition(currentIndex);
      startAutoScroll();
    }

    // Start auto scrolling carousel every 5 seconds
    function startAutoScroll() {
      stopAutoScroll();
      autoScrollInterval = setInterval(() => {
        if (!isAnimating) nextSlide();
      }, 5000);
    }

    // Stop auto scrolling
    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }

    /* ================================
       Touch Event Handlers for Swipe
    ================================ */
    function handleTouchStart(e) {
      touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }

    // Detect swipe direction and change slide accordingly
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum swipe distance in px
      if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
      }
    }

    /* ================================
       Register Event Listeners
    ================================ */
    track.addEventListener('transitionend', handleTransitionEnd);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Pause on hover, resume on leave
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoScroll);
      carouselContainer.addEventListener('mouseleave', startAutoScroll);
    }

    // Re-measure on resize: the stride changes at each breakpoint, and the old code
    // only patched the current transform while every later slide kept the stale width.
    window.addEventListener('resize', () => {
      itemWidth = getItemWidth();
      track.style.transition = 'none';
      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    });

    // Start auto-scroll initially
    startAutoScroll();
  }

  /* ================================
     Stats Animation on Scroll
  ================================ */
  const counters = document.querySelectorAll('.stat-number');
  let statsAnimated = false; // Ensure animation happens once

  // Animate individual counter numbers
  function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    if (!Number.isFinite(target)) return;

    // Years are shown as-is: no thousands separator, no count-up from zero.
    if (counter.dataset.format === 'year') {
      counter.textContent = String(target);
      return;
    }

    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      counter.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(updateCounter);
  }

  // Trigger animation when stats section enters viewport
  const statsSection = document.getElementById('stats');
  if (statsSection && counters.length) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          counters.forEach(animateCounter);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  }

  /* ================================
     Lazy Load Fade-In Animation
  ================================ */
  const lazyElements = document.querySelectorAll('.lazy-load');
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  lazyElements.forEach(el => lazyObserver.observe(el));


  /* ================================
     Meeting Calendar Rendering
  ================================ */
  const calContainer = document.getElementById('meeting-calendar');

  // Calculates first Friday date for given year/month
  function getFirstFriday(year, month) {
    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay();
    const diff = (5 - dayOfWeek + 7) % 7; // Friday is weekday 5
    return 1 + diff;
  }

  // Renders calendar HTML for month/year with meeting highlights
  function renderCalendar(year, month) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const today = new Date();
    const meetingDate = getFirstFriday(year, month);

    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    let date = 1;
    let html = `
      <div class="calendar-header">
        <button aria-label="Previous month" id="cal-prev">&lt;</button>
        <span style="font-size:1.1em; font-weight:600;">${monthNames[month]} ${year}</span>
        <button aria-label="Next month" id="cal-next">&gt;</button>
      </div>
      <table class="calendar-table">
        <thead>
          <tr>
            <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < 6; i++) {
      html += '<tr>';
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          html += `<td></td>`;
        } else if (date > lastDate) {
          html += `<td></td>`;
        } else {
          const classes = [];

          // Highlight today
          if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            date === today.getDate()
          ) classes.push('today');

          // Highlight meeting day (first Friday)
          if (date === meetingDate) classes.push('meeting-day');

          html += `<td class="${classes.join(' ')}">${date}</td>`;
          date++;
        }
      }
      html += '</tr>';
      if (date > lastDate) break;
    }

    html += `
        </tbody>
      </table>
      <div style="font-size:0.98em; margin-top:9px;">
        <span style="display:inline-block; width:18px; height:18px; background:#2363a9; border-radius:50%; margin-right:6px; border:2px solid #fecd38; vertical-align:-4px;"></span>
        <b>First Friday</b> = NYPSU Meeting<br>
        <span style="color:#6c757d; font-size:0.95em;">Click &lt; or &gt; to check future months!</span>
      </div>
    `;

    calContainer.innerHTML = html;

    // Handle month stepping; Date normalises the year rollover in both directions
    const step = delta => {
      const d = new Date(year, month + delta, 1);
      renderCalendar(d.getFullYear(), d.getMonth());
    };
    calContainer.querySelector('#cal-prev').addEventListener('click', () => step(-1));
    calContainer.querySelector('#cal-next').addEventListener('click', () => step(1));
  }

  // Initial render for current month
  if (calContainer) {
    const now = new Date();
    renderCalendar(now.getFullYear(), now.getMonth());
  }
});