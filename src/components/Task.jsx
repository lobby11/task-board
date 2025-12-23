
// ============================================
// FILE: components/Task.jsx
// ============================================
import React from 'react';
import { getDaysUntilDue } from '../utils/dateUtils';

export default function Task({ 
  task, 
  columnId, 
  handleDragStart, 
  handleDragEnd, 
  handleDeleteTask,
  toggleSubtask 
}) {
  const labels = {
    bug: { name: 'Bug', color: '#ef4444' },
    feature: { name: 'Feature', color: '#3b82f6' },
    design: { name: 'Design', color: '#8b5cf6' },
    improvement: { name: 'Improvement', color: '#10b981' }
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const daysUntil = task.dueDate ? getDaysUntilDue(task.dueDate) : null;

  const getDueDateClass = () => {
    if (!daysUntil) return '';
    if (daysUntil < 0) return 'overdue';
    if (daysUntil === 0) return 'due-today';
    if (daysUntil <= 2) return 'due-soon';
    return '';
  };

  return (
    <div
      className="task"
      draggable="true"
      onDragStart={() => handleDragStart(task, columnId)}
      onDragEnd={handleDragEnd}
    >
      {task.label && (
        <span 
          className="task-label" 
          style={{ '--label-color': labels[task.label]?.color }}
        >
          {labels[task.label]?.name}
        </span>
      )}
      
      <h2>{task.title}</h2>
      <p>{task.desc}</p>

      {task.dueDate && (
        <div className={`due-date ${getDueDateClass()}`}>
          <span className="due-date-icon">📅</span>
          {daysUntil < 0 && `Overdue by ${Math.abs(daysUntil)} days`}
          {daysUntil === 0 && 'Due today'}
          {daysUntil > 0 && `${daysUntil} days left`}
        </div>
      )}

      {totalSubtasks > 0 && (
        <div className="subtasks-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="subtasks-list">
            {task.subtasks.map(subtask => (
              <div key={subtask.id} className="subtask-item">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(columnId, task.id, subtask.id)}
                />
                <span className={subtask.completed ? 'completed' : ''}>
                  {subtask.text}
                </span>
              </div>
            ))}
          </div>
          <div className="subtask-counter">
            {completedSubtasks}/{totalSubtasks} completed
          </div>
        </div>
      )}

      <button
        className="delete-btn"
        onClick={() => handleDeleteTask(columnId, task.id)}
      >
        Delete
      </button>
    </div>
  );
}
