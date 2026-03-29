import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumeDocument from './ResumeDocument';

const DownloadResumeButton = ({ data }) => (
  <PDFDownloadLink
    document={<ResumeDocument data={data} />}
    fileName="Tailored_Resume.pdf"
    style={{
      backgroundColor: '#27ae60',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '20px',
      textDecoration: 'none',
      display: 'inline-block',
    }}
  >
    {({ loading }) => (loading ? 'Preparing PDF...' : 'Download Tailored Resume (PDF)')}
  </PDFDownloadLink>
);

export default DownloadResumeButton;
