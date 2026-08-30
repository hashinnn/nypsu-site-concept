/* ================================
   Navbar Scroll Class Toggle
   Adds/removes "scrolled" class based on scroll position
================================ */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

/* ================================
   DOMContentLoaded - Setup FAQ & Animations
================================ */
document.addEventListener('DOMContentLoaded', function () {
  const faqCards = document.querySelectorAll('.faq-card');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const faqPanel = document.getElementById('faq-panel');

  /* ----------------------------
     Open/Close Helpers
     Keep the .active class and aria-expanded in sync
  ----------------------------- */
  function setCardOpen(card, open) {
    card.classList.toggle('active', open);
    const btn = card.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  function closeCard(card) {
    setCardOpen(card, false);
  }

  /* ----------------------------
     Show Only FAQ Cards in Selected Category
  ----------------------------- */
  function showCategory(category) {
    faqCards.forEach(card => {
      if (card.dataset.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
        closeCard(card); // Close if open
      }
    });
  }

  // Show first category by default if tabs exist
  if (categoryTabs.length > 0) {
    showCategory(categoryTabs[0].dataset.category);
  }

  /* ----------------------------
     Category Tabs Click Handler
     Switch active tab and show relevant FAQ cards with ripple effect
  ----------------------------- */
  function selectTab(tab) {
    categoryTabs.forEach(t => {
      const isSelected = t === tab;
      t.classList.toggle('active', isSelected);
      t.setAttribute('aria-selected', String(isSelected));
      t.tabIndex = isSelected ? 0 : -1;
    });
    if (faqPanel && tab.id) faqPanel.setAttribute('aria-labelledby', tab.id);
    showCategory(tab.dataset.category);
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', event => {
      selectTab(tab);
      createRipple(tab, event);
    });

    // Roving focus: a tablist is driven with arrow keys, not Tab.
    tab.addEventListener('keydown', e => {
      const keys = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const tabs = Array.from(categoryTabs);
      const step = keys[e.key];
      let next;
      if (step === 'first') next = tabs[0];
      else if (step === 'last') next = tabs[tabs.length - 1];
      else next = tabs[(tabs.indexOf(tab) + step + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* ----------------------------
     FAQ Accordion Toggle
     Only one FAQ open at a time
  ----------------------------- */
  faqCards.forEach(card => {
    const questionBtn = card.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = card.classList.contains('active');

      // Close all other FAQ cards
      faqCards.forEach(otherCard => {
        if (otherCard !== card) closeCard(otherCard);
      });

      // Toggle current card
      setCardOpen(card, !isActive);

      // Small button press animation
      questionBtn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        questionBtn.style.transform = '';
      }, 140);
    });
  });

  /* ----------------------------
     Fade-in Text Animation on Scroll
     Uses Intersection Observer to play animations when in viewport
  ----------------------------- */
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running'; // Play animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-40px',
  });

  // Initialize fade-text elements with paused animation, then observe them
  document.querySelectorAll('.fade-text').forEach(el => {
    el.style.animationPlayState = 'paused';
    io.observe(el);
  });

  /* ----------------------------
     Close All FAQ Cards on Escape Key Press
  ----------------------------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      faqCards.forEach(closeCard);
    }
  });

  /* ----------------------------
     Ripple Effect on Click for Tabs
  ----------------------------- */
  function createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    // Keyboard-triggered clicks report 0,0 - ripple from the centre instead.
    const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
    const y = event.clientY ? event.clientY - rect.top : rect.height / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      pointer-events: none;
      border-radius: 50%;
      background: rgba(255,255,255,0.13);
      width:48px; height:48px;
      left: ${x - 24}px; top: ${y - 24}px;
      animation: rippleAnim 0.5s ease;
      z-index: 2;
    `;
    element.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  /* ----------------------------
     Inject Ripple Animation Keyframes
  ----------------------------- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});