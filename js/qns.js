document.addEventListener('DOMContentLoaded', () => {
  /* ===========================
     Navbar Scroll Behavior
     Adds/removes 'scrolled' class based on scrollY position
  =========================== */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* ===========================
     Lazy Loading Fade-In
     Uses IntersectionObserver to add 'visible' class on elements in viewport
  =========================== */
  const lazyElements = document.querySelectorAll('.lazy-load');
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing after reveal
      }
    });
  }, { threshold: 0.2 });
  lazyElements.forEach(el => lazyObserver.observe(el));

  /* ===========================
     Form Handling and Validation
  =========================== */
  const form = document.getElementById('enquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const submitText = document.getElementById('submitText');
  const submitIcon = document.getElementById('submitIcon');
  const loadingSpinner = document.getElementById('loadingSpinner');

  // Nothing below makes sense without the form.
  if (!form) return;

  /**
   * Validates form data object for required fields and formats
   * @param {Object} data - key/value pairs of form fields
   * @returns {boolean} true if valid; false otherwise
   */
  function validate(data) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'enquiry'];
    for (let field of required) {
      if (!data[field] || data[field].trim() === '') {
        alert('Please fill in all required fields.');
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (!/^\d{8}$/.test(data.phone)) {
      alert('Please enter a valid 8-digit phone number.');
      return false;
    }
    return true;
  }

  /**
   * Updates button and loading UI based on loading state
   * @param {boolean} isLoading
   */
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitText.textContent = isLoading ? 'Submitting...' : 'Submit Enquiry';
    submitIcon.style.display = isLoading ? 'none' : 'inline-block';
    loadingSpinner.style.display = isLoading ? 'block' : 'none';
    submitBtn.setAttribute('aria-busy', isLoading);
  }

  /**
   * Extracts form data as an object from a form element
   * @param {HTMLFormElement} formElement
   * @returns {Object} data
   */
  function getFormData(formElement) {
    const data = {};
    new FormData(formElement).forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  // Form submission event handler
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = getFormData(form);
    if (!validate(data)) return;

    setLoading(true);

    // Simulate async submission delay
    setTimeout(() => {
      alert("Thanks for your enquiry. We will be in touch within the next 24 hours!");
      form.reset();
      clearInputStyles();
      setLoading(false);
    }, 2000);
  });

  // Reset button event handler
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearInputStyles();
      alert('All fields have been reset.');
    });
  }

  /* ===========================
     Input Focus and Validation Styles
  =========================== */
  const inputs = form.querySelectorAll('.form-input, .form-textarea');

  function clearInputStyles() {
    inputs.forEach(input => { input.style.borderColor = ''; });
  }

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (input.parentElement) input.parentElement.style.transform = 'scale(1.02)';
    });
    input.addEventListener('blur', () => {
      if (input.parentElement) input.parentElement.style.transform = 'scale(1)';
    });
    input.addEventListener('input', () => {
      if (input.validity.valid) {
        input.style.borderColor = '#4ECDC4';  // Green border if valid
      } else if (input.value.length > 0) {
        input.style.borderColor = '#FF6B6B';  // Red border if invalid and not empty
      } else {
        input.style.borderColor = 'rgba(250, 240, 230, 0.2)'; // Default border color if empty
      }
    });
  });

  /* ===========================
     Phone Input Formatting
     Limits input to digits only and max 8 characters
  =========================== */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 8);
    });
  }
});