const API_BASE = "https://resume-backend-fi-git-84b85b-akshat-parashars-projects-ecb7d349.vercel.app";
/**
 * AI Resume Analyzer - Global JavaScript
 * Handles all interactive functionality across pages
 */

// ===========================================
// Page Detection
// ===========================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

/* SIGN IN */
if (currentPage === 'signin.html') {
  const signinForm = document.getElementById('signinForm');
  const signinBtn = document.getElementById('signinBtn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  signinForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    signinBtn.textContent = "Signing in...";
    signinBtn.disabled = true;

    fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "dashboard.html";
      })
      .catch(err => {
        alert(err.message || "Login failed");
        signinBtn.textContent = "Sign In";
        signinBtn.disabled = false;
      });
  });
}

/* UPLOAD */
if (currentPage === 'upload.html') {
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fileInput');
  const fileInfo = document.getElementById('fileInfo');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const removeFileBtn = document.getElementById('removeFileBtn');
  const jobRoleSelect = document.getElementById('jobRole');
  const experienceSelect = document.getElementById('experienceLevel');

  let uploadedFile = null;

  // 👉 FORCE CLICK FILE PICKER
  uploadBox?.addEventListener('click', () => {
    console.log("Upload box clicked");
    fileInput.click();
  });

  // 👉 FILE SELECT HANDLER
  fileInput?.addEventListener('change', (e) => {
    uploadedFile = e.target.files[0];
    console.log("File selected:", uploadedFile);

    if (!uploadedFile) return;

    document.getElementById('fileName').textContent = uploadedFile.name;
    document.getElementById('fileSize').textContent = formatFileSize(uploadedFile.size);
    fileInfo.style.display = 'block';

    document.getElementById('uploadProgress').style.width = '100%';

    checkAnalyzeButton();
  });

  // Remove file
  removeFileBtn?.addEventListener('click', () => {
    uploadedFile = null;
    fileInfo.style.display = 'none';
    fileInput.value = '';
    document.getElementById('uploadProgress').style.width = '0%';
    checkAnalyzeButton();
  });

  function checkAnalyzeButton() {
    analyzeBtn.disabled = !(uploadedFile && jobRoleSelect.value && experienceSelect.value);
  }

  jobRoleSelect?.addEventListener('change', checkAnalyzeButton);
  experienceSelect?.addEventListener('change', checkAnalyzeButton);

  function formatFileSize(bytes) {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }
}


// ===========================================
// Dashboard Page
// ===========================================
if (currentPage === 'dashboard.html') {
  // Load analysis data if available
  const analysisData = localStorage.getItem('analysisData');

  if (analysisData) {
    const data = JSON.parse(analysisData);

    // Update scores with animation
    animateValue('resumeScore', 0, data.resumeScore, 1500);
    animateValue('atsScore', 0, data.atsScore, 1500);
    animateValue('skillMatch', 0, data.skillMatch, 1500);
  }

  // Animate number values
  function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;

    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = current;

      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
}



// ===========================================
// Navbar Active Link
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.navbar-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPage) {
      link.classList.add('active');
    } else if (!href) {
      // For buttons that don't have href
      return;
    } else {
      link.classList.remove('active');
    }
  });
});

// ===========================================
// Smooth Scroll for Anchor Links
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===========================================
// Animation on Scroll
// ===========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.card, .feature-card, .timeline-item').forEach(el => {
  observer.observe(el);
});

// ===========================================
// Utility Functions
// ===========================================

// Generate random score
function generateRandomScore(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===========================================
// Console Welcome Message
// ===========================================
console.log('%c⚡ ResumeAI - AI-Powered Resume Analyzer', 'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cBuilt with HTML, CSS, and Vanilla JavaScript', 'font-size: 12px; color: #a1a1aa;');
