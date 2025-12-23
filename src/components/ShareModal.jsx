
// ============================================
// FILE: components/ShareModal.jsx
// ============================================
import React, { useState, useEffect } from 'react';

export default function ShareModal({ isOpen, onClose, tasksData }) {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Encode the tasks data to base64 and create a shareable link
      const encodedData = btoa(JSON.stringify(tasksData));
      const link = `${window.location.origin}${window.location.pathname}?board=${encodedData}`;
      setShareLink(link);
    }
  }, [isOpen, tasksData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal share-modal active">
      <div className="bg" onClick={onClose}></div>
      <div className="center share-center">
        <h2>Share Board</h2>
        <p className="share-description">
          Anyone with this link can view your board
        </p>
        <div className="share-link-container">
          <input 
            type="text" 
            value={shareLink} 
            readOnly 
            className="share-link-input"
          />
          <button 
            className="copy-btn"
            onClick={copyToClipboard}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <button className="close-share-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

