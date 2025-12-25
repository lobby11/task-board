
// ============================================
// FILE: utils/exportUtils.js
// ============================================
export function exportToJSON(tasksData) {
  const dataStr = JSON.stringify(tasksData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kanban-board-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(tasksData) {
  let csv = 'Status,Title,Description,Label,Due Date,Subtasks\n';
  
  for (const [status, tasks] of Object.entries(tasksData)) {
    tasks.forEach(task => {
      const subtasksText = task.subtasks?.map(st => 
        `${st.completed ? '[x]' : '[ ]'} ${st.text}`
      ).join('; ') || '';
      
      csv += `"${status}","${task.title}","${task.desc || ''}","${task.label || ''}","${task.dueDate || ''}","${subtasksText}"\n`;
    });
  }
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kanban-board-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(tasksData) {
  // Create a printable HTML version
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Task Board</title>
      <style>
        body { font-family:  Segoe UI, sans-serif; padding: 20px; }
        h1 { text-align: center; color: #333; }
        .column { margin-bottom: 30px; font-weight: bold; }
        .column-title { background: #01001bff; color: white; padding: 10px; font-weight: bold; }
        .task { border: 1px solid #f0eeeeff; padding: 15px; margin: 5px 0; background: #f9f9f9; font-size: 20px; font-weight: bold;  }
        .task-title { font-weight: bold; margin-bottom: 5px; letter-spacing: 1.2px; }
        .task-label { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 14px; margin-bottom: 5px; }
        .subtask { font-size: 12x; }
      </style>
    </head>
    <body>
      <h1>Task Board Export</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
  `;

  const columns = { todo: 'To Do', progress: 'In Progress', done: 'Done' };
  
  for (const [key, title] of Object.entries(columns)) {
    html += `<div class="column"><div class="column-title">${title} (${tasksData[key].length})</div>`;
    
    tasksData[key].forEach(task => {
      html += `
        <div class="task">
          ${task.label ? `<span class="task-label" style="background: #ddd; ">${task.label}</span>` : ''}
          <div class="task-title">${task.title}</div>
          ${task.desc ? `<p>${task.desc}</p>` : ''}
          ${task.dueDate ? `<p><strong>Due:</strong> ${task.dueDate}</p>` : ''}
          ${task.subtasks && task.subtasks.length > 0 ? `
            <div><strong>Subtasks:</strong></div>
            ${task.subtasks.map(st => `
              <div class="subtask">${st.completed ? '☑' : '☐'} ${st.text}</div>
            `).join('')}
          ` : ''}
        </div>
      `;
    });
    
    html += '</div>';
  }
  
  html += '</body></html>';
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  
  setTimeout(() => {
    printWindow.print();
    URL.revokeObjectURL(url);
  }, 500);
}
