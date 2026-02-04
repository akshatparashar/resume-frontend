/**
 * AI Service for OpenAI Integration
 * Provides intelligent resume analysis using GPT models
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const USE_AI = process.env.USE_AI === 'true';

/**
 * Make request to OpenAI API
 */
async function makeOpenAIRequest(messages, temperature = 0.7) {
  if (!OPENAI_API_KEY) {
    console.warn('⚠️  OpenAI API key not configured. Using fallback analysis.');
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: messages,
        temperature: temperature,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return null;
  }
}

/**
 * Analyze resume content with AI
 */
exports.analyzeResumeWithAI = async (resumeContent, extractedData, targetRole) => {
  if (!USE_AI) {
    return null; // Fall back to rule-based analysis
  }

  const prompt = `You are an expert resume analyst and career coach. Analyze the following resume for a ${targetRole} position.

Resume Content:
${resumeContent.substring(0, 3000)} // Limit to avoid token limits

Extracted Skills: ${extractedData.skills?.join(', ') || 'None'}
Experience: ${extractedData.experience?.length || 0} roles listed
Education: ${extractedData.education?.length || 0} degrees listed

Please provide a detailed analysis in the following JSON format:
{
  "strengths": [
    "List 3-5 key strengths of this resume"
  ],
  "weaknesses": [
    "List 3-5 areas that need improvement"
  ],
  "missingSkills": [
    "List 5-8 important skills missing for ${targetRole} role"
  ],
  "recommendations": [
    "List 5-7 specific, actionable recommendations"
  ],
  "atsScore": {
    "score": "Number between 0-100",
    "reasoning": "Brief explanation of ATS score"
  },
  "resumeScore": {
    "score": "Number between 0-100",
    "reasoning": "Brief explanation of overall resume score"
  }
}

Focus on practical, actionable feedback. Be specific and constructive.`;

  const messages = [
    {
      role: 'system',
      content: 'You are an expert resume analyst with 15+ years of experience in recruiting and career coaching. Provide detailed, constructive, and actionable feedback.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await makeOpenAIRequest(messages, 0.7);

  if (response) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
  }

  return null;
};

/**
 * Generate personalized career recommendations
 */
exports.generateCareerPath = async (resumeData, targetRole, experienceLevel) => {
  if (!USE_AI) {
    return null;
  }

  const prompt = `You are a career mentor. Create a personalized career development plan.

Current Profile:
- Target Role: ${targetRole}
- Experience Level: ${experienceLevel}
- Current Skills: ${resumeData.extractedData?.skills?.join(', ') || 'Not specified'}
- Experience: ${resumeData.extractedData?.experience?.length || 0} roles

Generate a career roadmap in JSON format:
{
  "timeline": "Estimated time to reach target role (e.g., '12-18 months')",
  "phases": [
    {
      "phase": "Phase name (e.g., 'Master Frontend Frameworks')",
      "duration": "Duration (e.g., '0-3 months')",
      "skills": ["skill1", "skill2", "skill3"],
      "description": "What to focus on in this phase"
    }
  ],
  "prioritySkills": [
    {
      "skill": "Skill name",
      "priority": "high/medium/low",
      "estimatedTime": "Time to learn (e.g., '2-3 weeks')",
      "reason": "Why this skill is important"
    }
  ],
  "projectIdeas": [
    {
      "title": "Project name",
      "description": "Brief description",
      "skills": ["skill1", "skill2"],
      "duration": "Estimated duration"
    }
  ]
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are an experienced career mentor who helps professionals advance their careers through structured learning paths.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await makeOpenAIRequest(messages, 0.7);

  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI career path:', error);
    }
  }

  return null;
};

/**
 * Enhance job matching with AI insights
 */
exports.analyzeJobMatchWithAI = async (resumeContent, jobDescription, basicMatchResult) => {
  if (!USE_AI) {
    return null;
  }

  const prompt = `You are an expert at matching candidates to job descriptions.

Resume Summary:
${resumeContent.substring(0, 2000)}

Job Description:
${jobDescription.substring(0, 2000)}

Basic Match Score: ${basicMatchResult.matchScores.overall}%
Matched Skills: ${basicMatchResult.matchedSkills.join(', ')}
Missing Skills: ${basicMatchResult.missingSkills.join(', ')}

Provide enhanced analysis in JSON format:
{
  "fitAssessment": "Overall fit assessment (2-3 sentences)",
  "keyStrengths": [
    "Why this candidate is a good fit (3-5 points)"
  ],
  "gaps": [
    "Areas where candidate may need development (3-5 points)"
  ],
  "recommendations": [
    "How to improve match (5-7 actionable tips)"
  ],
  "interviewTips": [
    "What to emphasize in interviews (3-5 tips)"
  ],
  "salaryRange": {
    "estimated": "Estimated salary range based on skills/experience",
    "confidence": "high/medium/low"
  }
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are a senior technical recruiter with expertise in evaluating candidate-job fit.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await makeOpenAIRequest(messages, 0.7);

  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI job match:', error);
    }
  }

  return null;
};

/**
 * Generate resume improvement suggestions with AI
 */
exports.generateImprovementSuggestions = async (resumeContent, section) => {
  if (!USE_AI) {
    return null;
  }

  const sectionPrompts = {
    summary: 'Rewrite the professional summary to be more impactful and ATS-friendly.',
    experience: 'Suggest improvements for experience descriptions using action verbs and metrics.',
    skills: 'Recommend additional skills to add based on the resume content.',
    overall: 'Provide overall resume improvement suggestions.',
  };

  const prompt = `Analyze this resume section and provide specific improvements:

${resumeContent.substring(0, 2000)}

Task: ${sectionPrompts[section] || sectionPrompts.overall}

Provide response in JSON format:
{
  "suggestions": [
    {
      "type": "Type of improvement (e.g., 'Add metrics', 'Use action verbs')",
      "original": "Original text if applicable",
      "improved": "Improved version",
      "reasoning": "Why this is better"
    }
  ],
  "examples": [
    "Concrete examples of good practices"
  ]
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are an expert resume writer who helps professionals create compelling, ATS-optimized resumes.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await makeOpenAIRequest(messages, 0.7);

  if (response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI suggestions:', error);
    }
  }

  return null;
};

/**
 * Check if AI is enabled and configured
 */
exports.isAIEnabled = () => {
  return USE_AI && !!OPENAI_API_KEY;
};

/**
 * Get AI service status
 */
exports.getAIStatus = () => {
  return {
    enabled: USE_AI,
    configured: !!OPENAI_API_KEY,
    model: OPENAI_MODEL,
    status: USE_AI && OPENAI_API_KEY ? 'active' : 'disabled',
  };
};
