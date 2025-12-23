// ============================================
// FILE: components/TaskModal.jsx
// ============================================
import React from 'react';

export default function TaskModal({ 
  modalActive, 
  setModalActive, 
  taskTitle, 
  setTaskTitle,
  taskDesc,
  setTaskDesc,
  selectedLabel,
  setSelectedLabel,
  dueDate,
  setDueDate,
  subtasks,
  setSubtasks,
  handleAddTask 
}) {
  const labels = [
    { id: 'bug', name: 'Bug', color: '#ef4444' },
    { id: 'feature', name: 'Feature', color: '#3b82f6' },
    { id: 'design', name: 'Design', color: '#8b5cf6' },
    { id: 'improvement', name: 'Improvement', color: '#10b981' }
  ];

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), text: '', completed: false }]);
  };

  const updateSubtask = (id, text) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, text } : st));
  };

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  return (
    <div className={`modal add-new-task ${modalActive ? 'active' : ''}`}>
      <div className="bg" onClick={() => setModalActive(false)}></div>
      <div className="center enhanced-modal">
        <input
          id="task-title-input"
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <textarea
          id="task-desc-input"
          placeholder="Task Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        ></textarea>

        <div className="form-group">
          <label>Label</label>
          <div className="label-selector">
            {labels.map(label => (
              <button
                key={label.id}
                className={`label-btn ${selectedLabel === label.id ? 'selected' : ''}`}
                style={{ '--label-color': label.color }}
                onClick={() => setSelectedLabel(label.id)}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Subtasks</label>
          <div className="subtasks-container">
            {subtasks.map(subtask => (
              <div key={subtask.id} className="subtask-input-row">
                <input
                  type="text"
                  placeholder="Subtask name"
                  value={subtask.text}
                  onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                />
                <button 
                  className="remove-subtask-btn"
                  onClick={() => removeSubtask(subtask.id)}
                >
                  ×
                </button>
              </div>
            ))}
            <button className="add-subtask-btn" onClick={addSubtask}>
              + Add Subtask
            </button>
          </div>
        </div>

        <button id="add-new-task" className="add-task-btn" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
    </div>
  );
}


