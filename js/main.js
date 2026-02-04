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

  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (email && password) {
        // Show loading state
        signinBtn.textContent = 'Signing in...';
        signinBtn.disabled = true;

        // Simulate authentication delay
        setTimeout(() => {
          // Store mock user data
          localStorage.setItem('user', JSON.stringify({
            name: 'Akshat parashar',
            email: email,
            role: 'Software Engineer'
          }));

          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        }, 1000);
      }
    });
  }
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
// Job Match Page
// ===========================================
if (currentPage === 'job-match.html') {
  const jobDescription = document.getElementById('jobDescription');
  const analyzeMatchBtn = document.getElementById('analyzeMatchBtn');
  const matchResults = document.getElementById('matchResults');
  const sampleButtons = document.querySelectorAll('.sample-jd-btn');

  // Sample job descriptions
  const sampleJDs = {
    fullstack: `Senior Full Stack Developer

We are looking for an experienced Full Stack Developer to join our engineering team.

Requirements:
- 5+ years of experience in full stack development
- Strong proficiency in JavaScript, React, and Node.js
- Experience with TypeScript and modern frontend frameworks
- Knowledge of GraphQL and REST APIs
- Experience with MongoDB and SQL databases
- Familiarity with Docker and container orchestration (Kubernetes preferred)
- Understanding of CI/CD pipelines and DevOps practices
- Experience with cloud platforms (AWS, Azure, or GCP)
- Strong problem-solving skills and ability to work in agile teams
- Excellent communication and collaboration skills

Preferred:
- Experience with Next.js or similar React frameworks
- Knowledge of Redis or other caching solutions
- Experience with microservices architecture
- Understanding of testing frameworks (Jest, Cypress)

Responsibilities:
- Design and implement scalable full-stack applications
- Collaborate with cross-functional teams to define and ship new features
- Write clean, maintainable, and well-tested code
- Participate in code reviews and mentor junior developers
- Optimize applications for performance and scalability`,

    frontend: `Frontend Engineer - React

Join our team to build beautiful, responsive user interfaces.

Requirements:
- 3+ years of frontend development experience
- Expert knowledge of React and modern JavaScript (ES6+)
- Strong HTML, CSS, and responsive design skills
- Experience with state management (Redux, Context API)
- Familiarity with frontend build tools and bundlers
- Understanding of web performance optimization
- Experience with Git version control

Preferred:
- TypeScript experience
- Next.js or Gatsby knowledge
- UI/UX design skills
- Experience with testing libraries (Jest, React Testing Library)`,

    backend: `Backend Software Engineer

Build robust, scalable backend systems for our platform.

Requirements:
- 4+ years of backend development experience
- Strong proficiency in Node.js and Python
- Experience with SQL and NoSQL databases
- Knowledge of RESTful API design
- Understanding of microservices architecture
- Experience with cloud platforms (AWS preferred)
- Familiarity with Docker and containerization

Preferred:
- GraphQL experience
- Kubernetes knowledge
- Message queue systems (RabbitMQ, Kafka)
- Redis caching`
  };

  // Sample JD button clicks
  sampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');
      if (jobDescription && sampleJDs[role]) {
        jobDescription.value = sampleJDs[role];
        // Scroll to analyze button
        analyzeMatchBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Analyze match button
  if (analyzeMatchBtn) {
    analyzeMatchBtn.addEventListener('click', () => {
      const jdText = jobDescription.value.trim();

      if (!jdText) {
        alert('Please paste a job description first');
        return;
      }

      // Show loading state
      analyzeMatchBtn.textContent = 'Analyzing Match...';
      analyzeMatchBtn.disabled = true;

      // Simulate analysis
      setTimeout(() => {
        // Generate random but realistic scores
        const matchScore = Math.floor(Math.random() * 15) + 80;
        const skillsMatch = Math.floor(Math.random() * 15) + 75;
        const experienceMatch = Math.floor(Math.random() * 15) + 85;
        const keywordMatch = Math.floor(Math.random() * 15) + 70;

        // Update scores
        document.getElementById('matchScoreValue').innerHTML = matchScore + '<span style="font-size: 2rem;">%</span>';
        document.getElementById('skillsMatchScore').innerHTML = skillsMatch + '<span style="font-size: 1.5rem;">%</span>';
        document.getElementById('experienceMatchScore').innerHTML = experienceMatch + '<span style="font-size: 1.5rem;">%</span>';
        document.getElementById('keywordMatchScore').innerHTML = keywordMatch + '<span style="font-size: 1.5rem;">%</span>';

        // Update progress bars
        document.querySelectorAll('#matchResults .progress-fill').forEach((bar, index) => {
          const scores = [skillsMatch, experienceMatch, keywordMatch];
          if (index < scores.length) {
            bar.style.width = scores[index] + '%';
          }
        });

        // Show results
        matchResults.style.display = 'block';

        // Reset button
        analyzeMatchBtn.textContent = 'Analyze Match';
        analyzeMatchBtn.disabled = false;

        // Scroll to results
        matchResults.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    });
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
