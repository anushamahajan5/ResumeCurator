const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');
require('dotenv').config(); // For loading environment variables

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your frontend's URL if different
}));
app.use(express.json()); // For parsing application/json

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage: storage });

// Initialize Anthropic Claude client
// IMPORTANT: Replace 'YOUR_ANTHROPIC_API_KEY' with your actual Anthropic API key.
// It's highly recommended to use environment variables for API keys in production.
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_API_KEY', // Fallback for development
});

// Helper function to extract and clean text from PDF
async function extractResumeText(dataBuffer) {
    const data = await pdf(dataBuffer);
    let resumeText = data.text;

    // Basic cleaning: remove multiple newlines, trim whitespace, remove non-printable ASCII
    resumeText = resumeText.replace(/\n\s*\n/g, '\n') // Replace multiple newlines with a single one
                        .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
                        .replace(/[^\x20-\x7E\n\r\t]/g, ''); // Remove non-printable ASCII characters

    return resumeText;
}

// Helper function to construct the Claude prompt
function constructClaudePrompt(jobDescription, resumeText) {
    // The prompt content remains the same as before
    return `You are an expert resume writer. Your task is to tailor a given resume to a specific job description.

Here is the job description:
<job_description>
${jobDescription}
</job_description>

Here is the current resume content:
<resume_content>
${resumeText}
</resume_content>

Based on the job description, rewrite the resume content to highlight relevant experience and skills.
Additionally, identify any significant skills mentioned in the job description that are *missing* or *underrepresented* in the provided resume.

Your response MUST be a JSON object with the following structure. Do NOT include any other text or formatting outside of this JSON object.

{
  "name": "Applicant Name (extracted from resume or placeholder if not found)",
  "summary": "A concise, tailored summary highlighting key qualifications for the job.",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "dates": "Start Date - End Date",
      "description": "Bullet points describing achievements and responsibilities, tailored to the job description."
    }
    // ... more experience entries
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "dates": "Start Date - End Date"
    }
    // ... more education entries
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"], // Key skills from the tailored resume
  "skills_gap": ["Missing Skill 1", "Underrepresented Skill 2"] // Skills from JD not in resume
}
`;
}

// Helper function to call Claude API and parse response
async function getTailoredResumeFromClaude(prompt) {
    const claudeResponse = await anthropic.messages.create({
        model: "claude-3-opus-20240229", // Or "claude-3-sonnet-20240229", "claude-3-haiku-20240307"
        max_tokens: 4000,
        messages: [
            { role: "user", content: prompt }
        ],
    });
    return JSON.parse(claudeResponse.content[0].text);
}

// Endpoint to tailor the resume
app.post('/api/tailor', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No resume PDF file uploaded.' });
    }
    if (!req.body.jobDescription) {
        return res.status(400).json({ error: 'No job description provided.' });
    }

    try {
        // 1. Extract text from PDF
        const resumeText = await extractResumeText(req.file.buffer);

        if (!resumeText) {
            return res.status(400).json({ error: 'Could not extract text from the PDF.' });
        }

        // 2. Send text to Claude for tailoring
        const prompt = constructClaudePrompt(req.body.jobDescription, resumeText);
        const tailoredResumeJson = await getTailoredResumeFromClaude(prompt);
        res.json(tailoredResumeJson);

    } catch (error) {
        console.error('Error tailoring resume:', error);
        res.status(500).json({ error: 'Failed to tailor resume.', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});