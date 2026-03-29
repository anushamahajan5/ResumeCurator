## Resume Tailoring Bot Project Description

This project develops a full-stack application designed to assist users in tailoring their resumes to specific job descriptions using Artificial Intelligence. The application provides a seamless workflow where users can upload their existing resume (in PDF format), input a target job description, and receive an AI-generated tailored resume. A key feature is the "gap analysis," which identifies skills from the job description that are either missing or underrepresented in the user's original resume, offering actionable insights for improvement. The final tailored resume can be conveniently downloaded as a professional PDF document.

**Technologies Used:**

-   **Backend (Node.js with Express):**
    *   **Express.js:** For building the RESTful API.
    *   **OpenAI API:** Integrated for advanced natural language processing to understand job descriptions, analyze resumes, and generate tailored content.
    *   **Multer:** Handles multipart/form-data, specifically for uploading resume PDF files.
    *   **PDF-Lib:** Used for basic text extraction from uploaded PDF resumes.
    *   **Sequelize (ORM) & SQLite3:** An Object-Relational Mapper (ORM) for Node.js, paired with SQLite3 as a lightweight, file-based SQL database. This database is used to store operational metrics and records for each resume tailoring request, including job description length, resume text length, identified skills gaps, processing duration, success status, and the AI model used.
    *   **Dotenv:** Manages environment variables for sensitive information like API keys.
    *   **CORS:** Configured to allow secure communication between the frontend and backend.

-   **Frontend (React):**
    *   **React.js:** A JavaScript library for building interactive user interfaces.
    *   **@react-pdf/renderer:** Enables the dynamic generation of PDF documents directly from React components, formatting the AI-tailored resume data into a professional layout.
    *   **CSS:** For styling the application's user interface.

**Core Functionality:**

-   **Resume Upload & Job Description Input:** Users can easily upload their resume PDF and paste the job description.
-   **AI-Powered Tailoring:** The backend processes the inputs using OpenAI's capabilities to generate a customized resume.
-   **Skills Gap Analysis:** Identifies and displays skills from the job description that are not adequately covered in the user's resume.
-   **PDF Generation:** The tailored resume is presented in a downloadable PDF format.
-   **Metrics & Logging:** Each tailoring request is logged to an SQLite database, providing valuable operational insights.

---

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