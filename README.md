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

## Steps to Clone and Run the Application Locally

To get the Resume Tailoring Bot up and running on your local machine, follow these instructions:

### 1. Prerequisites

Before you begin, ensure you have the following installed:

-   **Git:** For cloning the repository. Download from [git-scm.com](https://git-scm.com/).
-   **Node.js & npm:** Node.js (which includes npm, the Node Package Manager) is required for both the backend and frontend. It's recommended to use a recent LTS (Long Term Support) version. Download from [nodejs.org](https://nodejs.org/).

### 2. Clone the Repository

Open your terminal or command prompt and execute the following command to clone the project from GitHub:

```bash
git clone https://github.com/anushamahajan5/ResumeCurator.git
```

### 3. Navigate to the Project Directory

Change your current directory to the root of the cloned project:

```bash
cd ResumeCurator
```

### 4. Set up and Run the Backend

The backend handles API requests, PDF processing, OpenAI integration, and database operations.

-   **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
-   **Install backend dependencies:**
    ```bash
    npm install
    ```
-   **Configure OpenAI API Key:**
    *   Create a file named `.env` in the `backend` directory (e.g., `ResumeCurator/backend/.env`).
    *   Add your OpenAI API key to this file. **Crucially, replace `your_openai_api_key_here` with your actual key.**
        ```dotenv
        OPENAI_API_KEY=your_openai_api_key_here
        PORT=3001
        ```
-   **Start the backend server:**
    ```bash
    node server.js
    ```
    You should see messages indicating the server is running on `http://localhost:3001` and the database is synchronized. Keep this terminal window open and running.

### 5. Set up and Run the Frontend

The frontend provides the user interface for interacting with the application.

-   **Open a new terminal or command prompt window.**
-   **Navigate to the frontend folder:**
    ```bash
    cd ../frontend # Assuming you are still in the 'backend' directory from the previous step
    # or if you are in the project root: cd frontend
    ```
-   **Install frontend dependencies:**
    ```bash
    npm install
    ```
-   **Start the frontend development server:**
    ```bash
    npm start
    ```
    This command will typically open your default web browser to `http://localhost:3000`. If it doesn't, manually navigate to that URL.

### 6. Interact with the Application

With both the backend and frontend servers running, you can now access the Resume Tailoring Bot in your browser at `http://localhost:3000`. You can upload a PDF resume, paste a job description, and use the AI tailoring features.
