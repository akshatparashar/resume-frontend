const API_BASE = "https://resume-backend-fi-git-84b85b-akshat-parashars-projects-ecb7d349.vercel.app";
/**
 * AI Resume Analyzer - Global JavaScript
 * Handles all interactive functionality across pages
 */

// ===========================================
// Page Detection
// ===========================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ===========================================
// Sign In Page
// ===========================================
if (currentPage === 'signin.html') {
  const signinForm = document.getElementById('signinForm');
  const signinBtn = document.getElementById('signinBtn');

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

// ===========================================
// Upload Page
// ===========================================
if (currentPage === 'upload.html') {
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fileInput');
  const fileInfo = document.getElementById('fileInfo');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const removeFileBtn = document.getElementById('removeFileBtn');
  const jobRoleSelect = document.getElementById('jobRole');
  const experienceSelect = document.getElementById('experienceLevel');

  let uploadedFile = null;

  // Click to upload
  if (uploadBox) {
    uploadBox.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // Drag and drop
  if (uploadBox) {
    uploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBox.classList.add('dragover');
    });

    uploadBox.addEventListener('dragleave', () => {
      uploadBox.classList.remove('dragover');
    });

    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.classList.remove('dragover');

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });
  }

  // File input change
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  // Handle file upload
  function handleFileUpload(file) {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    uploadedFile = file;

    // Display file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    fileInfo.style.display = 'block';

    // Simulate upload progress
    const progressBar = document.getElementById('uploadProgress');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressBar.style.width = progress + '%';

      if (progress >= 100) {
        clearInterval(interval);
        checkAnalyzeButton();
      }
    }, 100);
  }

  // Remove file
  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', () => {
      uploadedFile = null;
      fileInfo.style.display = 'none';
      fileInput.value = '';
      document.getElementById('uploadProgress').style.width = '0%';
      checkAnalyzeButton();
    });
  }

  // Check if analyze button should be enabled
  function checkAnalyzeButton() {
    if (analyzeBtn) {
      const canAnalyze = uploadedFile && jobRoleSelect.value && experienceSelect.value;
      analyzeBtn.disabled = !canAnalyze;
    }
  }

  // Job role and experience change
  if (jobRoleSelect) {
    jobRoleSelect.addEventListener('change', checkAnalyzeButton);
  }

  if (experienceSelect) {
    experienceSelect.addEventListener('change', checkAnalyzeButton);
  }

  // Analyze button click
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      analyzeBtn.textContent = 'Analyzing...';
      analyzeBtn.disabled = true;

      // Simulate analysis
      setTimeout(() => {
        // Store analysis data
        const analysisData = {
          resumeScore: Math.floor(Math.random() * 20) + 80,
          atsScore: Math.floor(Math.random() * 20) + 80,
          skillMatch: Math.floor(Math.random() * 20) + 70,
          jobRole: jobRoleSelect.value,
          experienceLevel: experienceSelect.value,
          fileName: uploadedFile.name,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('analysisData', JSON.stringify(analysisData));

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      }, 2000);
    });
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}


// ===========================================
// Dashboard Page
// ===========================================
if (currentPage === 'dashboard.html') {
  const data = JSON.parse(localStorage.getItem("analysisData") || "{}");

  function animateValue(id, end) {
    let current = 0;
    const el = document.getElementById(id);
    if (!el) return;
    const interval = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= end) clearInterval(interval);
    }, 20);
  }

  animateValue("resumeScore", data.resumeScore || 0);
  animateValue("atsScore", data.atsScore || 0);
  animateValue("skillMatch", data.skillMatch || 0);
}

// ===========================================
// Job Match Page
// ===========================================
if (currentPage === 'job-match.html') {
  document.getElementById('analyzeMatchBtn')?.addEventListener('click', () => {
    const jdText = jobDescription.value.trim();

    analyzeMatchBtn.textContent = "Analyzing...";
    analyzeMatchBtn.disabled = true;

    fetch(`${API_BASE}/api/job-match/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: jdText })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error();

        matchScoreValue.innerHTML = data.matchScore + "%";
        skillsMatchScore.innerHTML = data.skillsMatch + "%";
        experienceMatchScore.innerHTML = data.experienceMatch + "%";
        keywordMatchScore.innerHTML = data.keywordMatch + "%";

        matchResults.style.display = "block";
        analyzeMatchBtn.textContent = "Analyze Match";
        analyzeMatchBtn.disabled = false;
      })
      .catch(() => {
        alert("Match analysis failed");
        analyzeMatchBtn.textContent = "Analyze Match";
        analyzeMatchBtn.disabled = false;
      });
  });
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
