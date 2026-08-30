document.addEventListener('DOMContentLoaded', () => {
  /* ============================
     Navbar Scroll Effect
  ============================ */
  const navbar = document.querySelector('.navbar');  // Select the navbar element
  if (navbar) {
    window.addEventListener('scroll', () => {
      // Toggle the 'scrolled' class on navbar if scroll more than 10px vertically
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  
  /* ============================
     Form Handling & Validation
  ============================ */
  const form = document.getElementById('joinForm');           // Get join form element
  const submitBtn = document.getElementById('submitBtn');     // Submit button element
  const submitText = document.getElementById('submitText');   // Submit button text element
  const submitIcon = document.getElementById('submitIcon');   // Submit button icon element
  const loadingSpinner = document.getElementById('loadingSpinner'); // Loading spinner shown while submitting

  // Nothing below makes sense without the form.
  if (!form) return;

  
  // Interview slots. These used to be five hard-coded dates in August 2025, which
  // meant that from September 2025 onwards no date at all passed validation. Build
  // them from today instead so the form never goes stale.
  const SLOT_COUNT = 5;
  const SLOT_WEEKDAYS = [1, 3, 5];   // Mon / Wed / Fri
  const DAYS_LEAD_TIME = 7;          // First slot is a week out

  function toISODate(d) {
    // Local calendar date - toISOString() would shift across the UTC boundary.
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function buildInterviewSlots() {
    const slots = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    cursor.setDate(cursor.getDate() + DAYS_LEAD_TIME);

    while (slots.length < SLOT_COUNT) {
      if (SLOT_WEEKDAYS.includes(cursor.getDay())) slots.push(toISODate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return slots;
  }

  const allowedDates = buildInterviewSlots();

  // Interview date input element
  const dateInput = document.getElementById('interviewDate');

  if (dateInput) {
    // Bound the native picker to the offered range.
    dateInput.min = allowedDates[0];
    dateInput.max = allowedDates[allowedDates.length - 1];

    // Show the same list the validator enforces.
    const hint = document.getElementById('interviewDateHint');
    if (hint) {
      const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
      const pretty = allowedDates.map(d => fmt.format(new Date(`${d}T00:00:00`)));
      hint.textContent = `Upcoming interview slots: ${pretty.join(', ')}`;
    }

    // 'change' rather than 'input': a date field emits input for half-typed dates,
    // so the old handler fired an alert on the way to a perfectly valid entry.
    dateInput.addEventListener('change', () => {
      if (dateInput.value && !allowedDates.includes(dateInput.value)) {
        alert('Please select an available interview date.');
        dateInput.value = '';
      }
    });
  }


  // Function to validate form data fields
  function validate(data) {
    // Required fields list
    const required = ['firstName', 'lastName', 'email', 'phone', 'school', 'course', 'interviewDate', 'interviewTime'];

    // Check for empty required fields
    for (let field of required) {
      if (!data[field] || data[field].trim() === '') {
        alert('Please fill in all required fields.');
        return false;
      }
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    // Phone number format: exactly 8 digits
    if (!/^\d{8}$/.test(data.phone)) {
      alert('Please enter a valid 8-digit phone number.');
      return false;
    }

    return true;  // All validations passed
  }


  // Extract all form data into an object
  function getFormData(formElement) {
    const data = {};
    new FormData(formElement).forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }


  // Update UI state for loading/spinner on form submit
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;  // Disable or enable submit button
    submitText.textContent = isLoading ? 'Submitting...' : 'Submit Application'; // Change text accordingly
    submitIcon.style.display = isLoading ? 'none' : 'inline-block';  // Hide/show icon
    loadingSpinner.style.display = isLoading ? 'block' : 'none';    // Show/hide spinner
    submitBtn.setAttribute('aria-busy', isLoading);                  // Accessibility attribute
  }


  // Handle form submission event
  form.addEventListener('submit', e => {
    e.preventDefault();                         // Stop default form submit
    const data = getFormData(form);             // Extract form data

    if (!validate(data)) return;                 // Abort if validation fails

    setLoading(true);                            // Show loading UI

    setTimeout(() => {                           // Simulate async submission delay (e.g., API call)
      alert("Thank you for your interest in joining NYPSU. We will get back to you soon!");
      form.reset();                             // Reset form inputs
      clearInputStyles();                       // Drop the leftover validation borders
      setLoading(false);                        // Reset button/loading UI
    }, 2000);
  });


  // Reset button handler
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();                             // Clear all form fields
      clearInputStyles();
      alert('All fields have been reset.');
    });
  }


  /* ============================
     Input Fields UI Feedback
  ============================ */
  const inputs = form.querySelectorAll('.form-input, .form-textarea');

  function clearInputStyles() {
    inputs.forEach(input => { input.style.borderColor = ''; });
  }

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');  // Add focus class to input's parent (optional styling)
    });
    input.addEventListener('blur', () => {
      input.parentElement?.classList.remove('focused'); // Remove focus class on blur
    });

    input.addEventListener('input', () => {
      // Change border color based on validity
      if (input.validity.valid) {
        input.style.borderColor = '#4ECDC4';  // Green border on valid input
      } else if (input.value.length > 0) {
        input.style.borderColor = '#FF6B6B';  // Red border on invalid input
      } else {
        input.style.borderColor = 'rgba(250, 240, 230, 0.2)'; // Default border color when empty
      }
    });
  });


  /* ============================
     Phone Input Restrictions
  ============================ */
  const phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      // Allow only digits, max 8 characters
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 8);
    });
  }
});