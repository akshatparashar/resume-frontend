const API_BASE = "https://resume-backend-final-tawny.vercel.app";/**
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

console.log("JS loaded");

// ============================
// UPLOAD SYSTEM (FIXED)
// ============================

document.addEventListener("DOMContentLoaded", () => {

  const uploadBox = document.getElementById("uploadBox");
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const removeFileBtn = document.getElementById("removeFileBtn");
  const jobRoleSelect = document.getElementById("jobRole");
  const experienceSelect = document.getElementById("experienceLevel");

  let uploadedFile = null;

  if (uploadBox && fileInput) {
    console.log("Upload system active");

    uploadBox.style.pointerEvents = "auto";
    uploadBox.style.zIndex = "10";

    uploadBox.addEventListener("click", () => {
      console.log("Upload clicked");
    
      if (fileInput) {
        fileInput.dispatchEvent(new MouseEvent("click"));
      }
    });

    uploadBox.addEventListener("dragover", e => {
      e.preventDefault();
      uploadBox.classList.add("dragover");
    });

    uploadBox.addEventListener("dragleave", () => {
      uploadBox.classList.remove("dragover");
    });

    uploadBox.addEventListener("drop", e => {
      e.preventDefault();
      uploadBox.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", e => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  function handleFileUpload(file) {
    console.log("File selected:", file.name);

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!validTypes.includes(file.type)) {
      alert("Upload PDF or DOCX only");
      return;
    }

    uploadedFile = file;

    document.getElementById("fileName").textContent = file.name;
    document.getElementById("fileSize").textContent = formatFileSize(file.size);
    fileInfo.style.display = "block";

    document.getElementById("uploadProgress").style.width = "100%";

    checkAnalyzeButton();
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", () => {
      uploadedFile = null;
      fileInfo.style.display = "none";
      fileInput.value = "";
      document.getElementById("uploadProgress").style.width = "0%";
      checkAnalyzeButton();
    });
  }

  function checkAnalyzeButton() {
    if (!analyzeBtn) return;
    analyzeBtn.disabled = !(uploadedFile && jobRoleSelect.value && experienceSelect.value);
  }

  jobRoleSelect?.addEventListener("change", checkAnalyzeButton);
  experienceSelect?.addEventListener("change", checkAnalyzeButton);

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", async () => {
      analyzeBtn.textContent = "Uploading...";
      analyzeBtn.disabled = true;
    
      try {
        const formData = new FormData();
        formData.append("resume", uploadedFile);
    
        const res = await fetch(
          "https://resume-backend-final-tawny.vercel.app/api/resumes/upload",
          {
            method: "POST",
            body: formData
          }
        );
    
        const data = await res.json();
    
        if (!data.success) throw new Error("Upload failed");
    
        localStorage.setItem("resumeId", data.resumeId);
        window.location.href = "dashboard.html";
    
      } catch (err) {
        console.error(err);
        alert("Resume upload failed");
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze Resume";
      }
    });
    
  }

  function formatFileSize(bytes) {
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }

});


// ============================
// JOB MATCH (FIXED)
// ============================

document.addEventListener("DOMContentLoaded", () => {

  const jobDescription = document.getElementById("jobDescription");
  const analyzeMatchBtn = document.getElementById("analyzeMatchBtn");
  const matchResults = document.getElementById("matchResults");
  const sampleButtons = document.querySelectorAll(".sample-jd-btn");

  const sampleJDs = {
    fullstack: "Looking for Full Stack Developer with React & Node",
    frontend: "React Frontend Engineer needed",
    backend: "Backend Node.js Engineer required"
  };

  sampleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      jobDescription.value = sampleJDs[role];
    });
  });

  if (analyzeMatchBtn) {
    analyzeMatchBtn.addEventListener("click", () => {
      if (!jobDescription.value.trim()) {
        alert("Paste JD first");
        return;
      }

      analyzeMatchBtn.textContent = "Analyzing...";

      setTimeout(() => {
        matchResults.style.display = "block";
        analyzeMatchBtn.textContent = "Analyze Match";
      }, 1200);
    });
  }

});


// ===========================================
// Dashboard Page
// ===========================================
if (currentPage === 'dashboard.html') {

  const resumeId = localStorage.getItem("resumeId");

  if (!resumeId) {
    console.log("No resumeId found");
  } else {

    async function loadDashboard() {

      try {

        const res = await fetch(`${API_BASE}/api/resumes/${resumeId}`);
        const data = await res.json();

        console.log("Resume data:", data);

        const skills = data.resume?.parsedData?.skills || [];

        const skillsContainer = document.getElementById("skillsContainer");

        if (skillsContainer) {

          skillsContainer.innerHTML = "";

          skills.forEach(skill => {

            const span = document.createElement("span");

            span.className = "skill-chip matched";

            span.textContent = skill;

            skillsContainer.appendChild(span);

          });

        }

      } catch (err) {

        console.error("Dashboard error:", err);

      }

    }

    loadDashboard();

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
