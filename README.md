# ⚡ AI-Powered Resume Analyzer & Career Mentor

A premium, futuristic web application for analyzing resumes, providing career guidance, and matching candidates with job descriptions using AI-powered insights.

## 🚀 Features

- **Resume Upload & Analysis** - Drag-and-drop resume upload with instant AI analysis
- **ATS Score Calculator** - Check how well your resume passes Applicant Tracking Systems
- **Skill Gap Detection** - Identify missing skills for your target role
- **Career Roadmap** - Personalized learning path to advance your career
- **Job Matching** - Compare your resume against job descriptions
- **Smart Suggestions** - AI-powered recommendations to improve your resume

## 🎨 Design Philosophy

- **Futuristic Dark Theme** - Modern, sleek interface with glassmorphism effects
- **Premium UI/UX** - Designed to feel like a real AI startup product
- **Smooth Animations** - Polished transitions and interactive elements
- **Responsive Layout** - Works seamlessly across all devices

## 📁 Project Structure

```
project/
├── index.html          # Landing page
├── signin.html         # Sign-in page
├── upload.html         # Resume upload page
├── dashboard.html      # Main dashboard
├── suggestions.html    # Resume feedback page
├── career.html         # Career mentor page
├── job-match.html      # Job description matching page
│
├── css/
│   └── style.css       # Global CSS with theme variables
│
├── js/
│   └── main.js         # Global JavaScript
│
└── assets/
    ├── icons/
    └── images/
```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, Flexbox, and Grid
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JS
- **No dependencies** - Runs entirely in the browser

## 🎯 Pages Overview

### 1. Landing Page (`index.html`)
- Hero section with compelling headline
- Feature showcase
- How it works section
- Call-to-action sections

### 2. Sign In Page (`signin.html`)
- Modern authentication form
- Glass-style card design
- Demo UI (no real authentication)

### 3. Upload Page (`upload.html`)
- Drag-and-drop file upload
- Job role selection
- Experience level selection
- Upload validation

### 4. Dashboard (`dashboard.html`)
- Sidebar navigation
- Resume score overview
- ATS score metrics
- Skill chips and badges
- Quick actions

### 5. Suggestions Page (`suggestions.html`)
- Resume strengths analysis
- Areas for improvement
- Missing skills detection
- Quick improvement tips

### 6. Career Mentor (`career.html`)
- Target role overview
- Career roadmap timeline
- Skills to learn
- Project recommendations

### 7. Job Match Page (`job-match.html`)
- Job description input
- Match score calculation
- Matched vs missing skills
- Keyword analysis
- Sample job descriptions

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0f` (Near black)
- **Cards**: `#1a1a24` (Dark gray)
- **Primary Accent**: `#6366f1` (Indigo)
- **Secondary Accent**: `#8b5cf6` (Violet)
- **Cyan Accent**: `#06b6d4` (Cyan)
- **Teal Accent**: `#14b8a6` (Teal)

### Typography
- **Font**: System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headings**: Bold, gradient text effects
- **Body**: Soft white and muted gray

### Components
- Glass-style navbar with blur effect
- Gradient buttons with hover animations
- Card components with subtle shadows
- Progress bars with shimmer effects
- Skill chips/badges
- Timeline/roadmap components
- Stat cards with top border accent

## 🚀 Getting Started

1. **Clone or download** the project
2. **Open** `index.html` in your browser
3. **Navigate** through the pages using the navbar or buttons

No build process required - everything works out of the box!

## 💡 Usage

### Upload a Resume
1. Go to the Upload page
2. Drag and drop your resume (PDF or DOCX)
3. Select your target job role
4. Select your experience level
5. Click "Analyze Resume"

### Match with Job Description
1. Navigate to Job Matching page
2. Paste a job description or use a sample
3. Click "Analyze Match"
4. View your match score and recommendations

### Explore Career Path
1. Visit the Career Mentor page
2. View your personalized roadmap
3. Check skills to learn
4. Explore project ideas

## 🎯 Key Features Implemented

### Interactive Features
- ✅ File upload with drag-and-drop
- ✅ Progress bars with animations
- ✅ Dynamic score generation
- ✅ Form validation
- ✅ Sample job description insertion
- ✅ Smooth page navigation
- ✅ Animated value counters
- ✅ Scroll animations

### UI Components
- ✅ Glassmorphism navbar
- ✅ Gradient buttons
- ✅ Stat cards
- ✅ Skill chips/badges
- ✅ Timeline component
- ✅ Match score display
- ✅ Sidebar navigation
- ✅ Progress indicators

## 🌐 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## 📱 Responsive Design

Fully responsive with breakpoints:
- Desktop: 1024px+
- Tablet: 768px - 1024px
- Mobile: < 768px

## ⚡ Performance

- No external dependencies
- Minimal file size
- Fast load times
- Smooth animations at 60fps
- Optimized CSS and JavaScript

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in `css/style.css`:

```css
:root {
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  /* ... more variables */
}
```

### Modify Content
All content is in the HTML files - simply edit the text directly.

### Add New Pages
1. Create new HTML file
2. Link global CSS: `<link rel="stylesheet" href="css/style.css">`
3. Link global JS: `<script src="js/main.js"></script>`
4. Add navigation link in navbar

## 📝 Notes

- This is a **demo/frontend-only** application
- No real AI processing or backend integration
- Uses mock data and simulated scores
- LocalStorage used for basic state management
- Ready for backend integration

## 🚀 Future Enhancements

Potential features to add:
- Real AI/ML integration
- Backend API for resume parsing
- User authentication
- Resume template builder
- PDF generation
- Email notifications
- Social sharing
- Analytics dashboard

## 📄 License

This project is free to use for educational and personal purposes.

## 👨‍💻 Author

Built with ❤️ using pure HTML, CSS, and JavaScript

---

**Made for professionals seeking to advance their careers with AI-powered insights**
