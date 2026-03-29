Please provide the boilerplate and core logic for the Resume Tailoring Bot. I need:

The Express Backend (server.js):
    * An endpoint /api/tailor that accepts a PDF file and a job description string.

Logic to extract text from the PDF using pdf-lib.

A function to send that text + JD to OpenAI. Important: Instruct OpenAI to return the rewritten resume only as a structured JSON object (e.g., { "name": "", "summary": "", "experience": [...], "skills_gap": [...] }).

The React Frontend:

A simple upload zone for the PDF and a textarea for the Job Description.

A loading state while the AI is thinking.

A 'Gap Analysis' component that displays the missing skills OpenAI identified.

The PDF Component:

A basic @react-pdf/renderer template that takes the JSON response and formats it into a clean, professional PDF layout.

Keep the code concise and include comments on where to place the OpenAI API key.
