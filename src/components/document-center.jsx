import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/upload-document.css';

const DocumentCenter = () => {
  const [filename, setFilename] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('filename', filename);
    formData.append('document', file);

    setIsLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:3004/api/upload-text-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message || 'Document uploaded successfully!');
      fetchDocuments();
    } catch (error) {
      setMessage('Error uploading document.');
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchDocuments = async () => {
    setIsLoading(true); // Start loading for documents
    try {
      const response = await fetch('http://localhost:3004/api/get-all-documents-data');
      const data = await response.json();
      setDocuments(data?.allDocumentsData || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchDocumentContent = async (filename) => {
    try {
      const response = await fetch(`http://localhost:3004/api/get-document-content/${filename}`);
      const data = await response.json();

      if (data.content) {
        navigate(`/document/${filename}`, { state: { content: data.content } });
      } else {
        setMessage('Error fetching document content.');
      }
    } catch (error) {
      console.error('Error fetching document content:', error);
      setMessage('Error fetching document content.');
    }
  };

  const handleDocumentClick = (filename) => {
    fetchDocumentContent(filename);
  };

  const handleDeleteDocument = async (filename) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the document '${filename}'?`);

    if (confirmDelete) {
      setIsLoading(true); // Start loading

      try {
        const response = await fetch(`http://localhost:3004/api/delete-document/${filename}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (response.ok) {
          setMessage(data.message);
          // Remove deleted document from the list
          setDocuments(documents.filter(doc => doc.filename !== filename));
        } else {
          setMessage(data.message || 'Error deleting document.');
        }
      } catch (error) {
        setMessage('Error deleting document.');
        console.error(error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload a Text Document</h2>

      <form className="upload-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="filename" className="form-label">File Name:</label>
          <input
            type="text"
            id="filename"
            name="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file" className="form-label">Choose File:</label>
          <input
            type="file"
            id="file"
            name="document"
            accept=".txt"
            onChange={handleFileChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">Upload Document</button>
      </form>

      {isLoading && <div className="loader"></div>} {/* Loader when uploading */}

      <div id="message" className="message">{message}</div>

      <h3 className="document-list-title">Available Documents</h3>
      <ul className="document-list">
        {documents.length === 0 && !isLoading && (
          <p>No documents available.</p>
        )}
        {documents.map((doc) => (
          <li
            key={doc._id}
            className="document-item"
            onClick={() => handleDocumentClick(doc.filename)}
          >
            <span className="document-name">{doc.filename || 'Untitled'}</span>
            <span className="document-date">
              {new Date(doc.createdAt).toLocaleString()}
            </span>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); 
                handleDeleteDocument(doc.filename);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentCenter;
