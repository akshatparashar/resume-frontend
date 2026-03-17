const Resume = require('../models/Resume');
const {
  generateCareerPath,
  generateImprovementSuggestions,
  getAIStatus,
  isAIEnabled,
} = require('../utils/aiService');

// @desc    Get AI service status
// @route   GET /api/ai/status
// @access  Public
exports.getStatus = async (req, res) => {
  try {
    const status = getAIStatus();

    res.status(200).json({
      success: true,
      ai: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate personalized career path
// @route   POST /api/ai/career-path
// @access  Private
exports.generateCareerPath = async (req, res) => {
  try {
    if (!isAIEnabled()) {
      return res.status(400).json({
        success: false,
        message: 'AI service is not enabled. Please configure OPENAI_API_KEY in environment variables.',
      });
    }

    const { resumeId, targetRole, experienceLevel } = req.body;

    // Get resume
    let resume;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
      if (!resume || resume.user.toString() !== req.user.id) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found',
        });
      }
    } else {
      // Get latest resume
      resume = await Resume.findOne({ user: req.user.id }).sort('-createdAt');
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Please upload a resume first',
        });
      }
    }

    // Generate career path
    const careerPath = await generateCareerPath(
      resume,
      targetRole || resume.targetRole || 'Software Engineer',
      experienceLevel || resume.experienceLevel || 'mid'
    );

    if (!careerPath) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate career path. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      careerPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate improvement suggestions for resume
// @route   POST /api/ai/suggestions
// @access  Private
exports.generateSuggestions = async (req, res) => {
  try {
    if (!isAIEnabled()) {
      return res.status(400).json({
        success: false,
        message: 'AI service is not enabled. Please configure OPENAI_API_KEY.',
      });
    }

    const { resumeId, section } = req.body;

    // Get resume
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Generate suggestions
    const suggestions = await generateImprovementSuggestions(
      resume.parsedContent,
      section || 'overall'
    );

    if (!suggestions) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate suggestions. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Analyze specific section of resume with AI
// @route   POST /api/ai/analyze-section
// @access  Private
exports.analyzeSection = async (req, res) => {
  try {
    if (!isAIEnabled()) {
      return res.status(400).json({
        success: false,
        message: 'AI service is not enabled.',
      });
    }

    const { resumeId, section, content } = req.body;

    if (!section || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide section and content',
      });
    }

    const suggestions = await generateImprovementSuggestions(content, section);

    res.status(200).json({
      success: true,
      analysis: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
