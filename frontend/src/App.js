import React, { useState } from 'react';

import './App.css';
import DownloadResumeButton from './DownloadResumeButton';
import ResumeDocument from './ResumeDocument';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tailoredResumeData, setTailoredResumeData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setTailoredResumeData(null);

    if (!selectedFile) {
      setError('Please upload a resume PDF.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:3001/api/tailor', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong on the server.');
      }

      const data = await response.json();
      setTailoredResumeData(data);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to tailor resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Tailoring Bot</h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="tailor-form">
          <div className="form-group">
            <label htmlFor="resume-upload">Upload Resume (PDF):</label>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf"
              onChange={handleFileChange}
            />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="job-description">Job Description:</label>
            <textarea
              id="job-description"
              rows="10"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={handleJobDescriptionChange}
            ></textarea>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Tailoring Resume...' : 'Tailor My Resume'}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>

        {isLoading && (
          <div className="loading-indicator">
            <p>Analyzing and tailoring your resume...</p>
            <div className="spinner"></div>
          </div>
        )}

        {tailoredResumeData && (
          <div className="results-section">
            <h2>Tailoring Results</h2>

            {tailoredResumeData.skills_gap && tailoredResumeData.skills_gap.length > 0 && (
              <div className="gap-analysis">
                <h3>Skills Gap Analysis:</h3>
                <p>The following skills from the job description were either missing or underrepresented in your resume:</p>
                <ul>
                  {tailoredResumeData.skills_gap.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
                <p>Consider adding or emphasizing these in your resume.</p>
              </div>
            )}

            <h3>Tailored Summary:</h3>
            <p>{tailoredResumeData.summary || 'No summary provided.'}</p>

            {/* Experience Section */}
            {tailoredResumeData.experience && tailoredResumeData.experience.length > 0 && (
              <div className="experience-section">
                <h3>Experience</h3>
                <ul>
                  {tailoredResumeData.experience.map((exp, idx) => (
                    <li key={idx}>
                      <strong>{exp.title}</strong> at <em>{exp.company}</em> ({exp.dates})
                      <ul>
                        {exp.description && exp.description.split('\n').map((desc, i) => (
                          desc.trim() && <li key={i}>{desc.trim()}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education Section */}
            {tailoredResumeData.education && tailoredResumeData.education.length > 0 && (
              <div className="education-section">
                <h3>Education</h3>
                <ul>
                  {tailoredResumeData.education.map((edu, idx) => (
                    <li key={idx}>
                      <strong>{edu.degree}</strong> at <em>{edu.institution}</em> ({edu.dates})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Section */}
            {tailoredResumeData.skills && tailoredResumeData.skills.length > 0 && (
              <div className="skills-section">
                <h3>Skills</h3>
                <ul>
                  {tailoredResumeData.skills.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* PDF Download Button */}
            <DownloadResumeButton data={tailoredResumeData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;