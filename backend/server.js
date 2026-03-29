const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const { PDFDocument } = require('pdf-lib'); // Modern PDF library
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

// --- Database Setup ---
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'), // Store SQLite file in backend directory
    logging: false, // Disable logging SQL queries to console
});

// Define TailoringRecord Model
const TailoringRecord = sequelize.define('TailoringRecord', {
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    jobDescriptionLength: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    resumeTextLength: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    skillsGapCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tailoringDurationMs: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    errorDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    modelUsed: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Helper function to extract text (Simple version for personal use)
async function extractTextFromPDF(buffer) {
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();
    let fullText = "";
    
    // Note: pdf-lib is great for structure, but for raw text extraction 
    // in a personal bot, we can also use the built-in 'buffer' to string 
    // if the PDF is text-encoded.
    fullText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, '');
    
    return fullText;
}

// Default home page route
app.get('/', (req, res) => {
    res.send('Resume Tailoring Bot Backend is running!');
});

app.post('/api/tailor', upload.single('resume'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    if (!req.body.jobDescription) return res.status(400).json({ error: 'No job description provided.' });

    const jobDescription = req.body.jobDescription;
    const jobDescriptionLength = jobDescription.length;
    let resumeTextLength = 0;
    let skillsGapCount = 0;
    let success = false;
    let errorDetails = null;
    const modelUsed = "gpt-4o"; // Hardcoded as per your current server.js
    const startTime = Date.now();

    try {
        // Extract text using the buffer directly (Fastest way for Resume PDFs)
        // Most resumes are standard text; if yours is an image, you'd need OCR.
        let resumeText = req.file.buffer.toString('utf8'); // Using buffer.toString as in your original code
        // Clean up some of the binary noise from the PDF formatting
        resumeText = resumeText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').substring(0, 10000);

        if (!resumeText || resumeText.length < 50) {
            return res.status(400).json({ error: "Text extraction failed. Please try a different PDF." });
        }

        resumeTextLength = resumeText.length;

        const response = await openai.chat.completions.create({
            model: modelUsed,
            messages: [{ 
                role: "system", 
                content: "You are a resume expert. I will provide raw PDF text (which may contain noise) and a JD. Extract the relevant resume info, rewrite it for the JD, and return a clean JSON object."
            },
            { 
                role: "user", 
                content: `JD: ${jobDescription}\n\nResume Text: ${resumeText}` 
            }],
            response_format: { type: "json_object" }
        });

        const tailoredResumeJson = JSON.parse(response.choices[0].message.content);
        skillsGapCount = tailoredResumeJson.skills_gap ? tailoredResumeJson.skills_gap.length : 0;
        success = true;
        res.json(tailoredResumeJson);

    } catch (error) {
        console.error('Final Error:', error);
        errorDetails = error.message;
        res.status(500).json({ error: "OpenAI or Server Error", details: error.message });
    } finally {
        const tailoringDurationMs = Date.now() - startTime;
        try {
            await TailoringRecord.create({
                timestamp: new Date(),
                jobDescriptionLength,
                resumeTextLength,
                skillsGapCount,
                tailoringDurationMs,
                success,
                errorDetails,
                modelUsed,
            });
            console.log('Tailoring record saved to database.');
        } catch (dbError) {
            console.error('Failed to save tailoring record to database:', dbError);
        }
    }
});

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server on ${port} - Using Stable Extraction`);
        console.log('Database synchronized.');
    });
}).catch(err => {
    console.error('Failed to synchronize database:', err);
});