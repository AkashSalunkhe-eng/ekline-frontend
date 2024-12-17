import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/document-viewer.css';

const DocumentViewer = () => {
  const { filename } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="document-viewer-container">
      <h2 className="document-viewer-title">Viewing Document: {filename}</h2>
      <div className="document-viewer-content">
        {state?.content || 'No content available.'}
      </div>
      <button className="back-button" onClick={handleBackClick}>
        Back to Document List
      </button>
    </div>
  );
};

export default DocumentViewer;
