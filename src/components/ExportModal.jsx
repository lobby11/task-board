

// ============================================
// FILE: components/ExportModal.jsx
// ============================================
import React from 'react';
import { exportToJSON, exportToCSV, exportToPDF } from '../utils/exportUtils';

export default function ExportModal({ isOpen, onClose, tasksData }) {
  if (!isOpen) return null;

  return (
    <div className="modal export-modal active">
      <div className="bg" onClick={onClose}></div>
      <div className="center export-center">
        <h2>Export Board</h2>
        <div className="export-options">
          <button 
            className="export-btn json-btn"
            onClick={() => {
              exportToJSON(tasksData);
              onClose();
            }}
          >
            <span className="export-icon">📄</span>
            Export as JSON
          </button>
          <button 
            className="export-btn csv-btn"
            onClick={() => {
              exportToCSV(tasksData);
              onClose();
            }}
          >
            <span className="export-icon">📊</span>
            Export as CSV
          </button>
          <button 
            className="export-btn pdf-btn"
            onClick={() => {
              exportToPDF(tasksData);
              onClose();
            }}
          >
            <span className="export-icon">📑</span>
            Export as PDF
          </button>
        </div>
        <button className="close-export-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

