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
  let uploadedFile = null;

  document.getElementById('fileInput')?.addEventListener('change', e => {
    uploadedFile = e.target.files[0];
  });

  document.getElementById('analyzeBtn')?.addEventListener('click', () => {
    const jobRole = document.getElementById('jobRole').value;
    const experienceLevel = document.getElementById('experienceLevel').value;

    const formData = new FormData();
    formData.append("resume", uploadedFile);
    formData.append("jobRole", jobRole);
    formData.append("experienceLevel", experienceLevel);

    fetch(`${API_BASE}/api/resumes/upload`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message);
        localStorage.setItem("analysisData", JSON.stringify(data.analysis));
        window.location.href = "dashboard.html";
      })
      .catch(() => alert("Upload failed"));
  });
}

/* JOB MATCH */
if (currentPage === 'job-match.html') {
  document.getElementById('analyzeMatchBtn')?.addEventListener('click', () => {
    const jdText = document.getElementById('jobDescription').value;

    fetch(`${API_BASE}/api/job-match/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: jdText })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error();
        document.getElementById('matchResults').style.display = "block";
      })
      .catch(() => alert("Match failed"));
  });
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
