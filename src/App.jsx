// ============================================
// FILE: src/App.jsx (REPLACE YOUR OLD ONE WITH THIS)
// ============================================
import React, { useState, useEffect } from 'react';
import TaskModal from './components/TaskModal';
import Task from './components/Task';
import ExportModal from './components/ExportModal';
import ShareModal from './components/ShareModal';
import { triggerConfetti } from './utils/confetti';

export default function App() {
  const [tasksData, setTasksData] = useState({ todo: [], progress: [], done: [] });
  const [modalActive, setModalActive] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tasksdata');
    if (stored) {
      setTasksData(JSON.parse(stored));
    }

    // Check if there's a shared board in URL
    const params = new URLSearchParams(window.location.search);
    const sharedBoard = params.get('board');
    if (sharedBoard) {
      try {
        const decodedData = JSON.parse(atob(sharedBoard));
        setTasksData(decodedData);
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        console.error('Invalid shared board link');
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasksdata', JSON.stringify(tasksData));
  }, [tasksData]);

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      desc: taskDesc,
      label: selectedLabel,
      dueDate: dueDate,
      subtasks: subtasks.filter(st => st.text.trim() !== '')
    };

    setTasksData(prev => ({
      ...prev,
      todo: [...prev.todo, newTask]
    }));

    // Reset form
    setTaskTitle('');
    setTaskDesc('');
    setSelectedLabel('');
    setDueDate('');
    setSubtasks([]);
    setModalActive(false);
  };

  const handleDeleteTask = (columnId, taskId) => {
    setTasksData(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(task => task.id !== taskId)
    }));
  };

  const toggleSubtask = (columnId, taskId, subtaskId) => {
    setTasksData(prev => ({
      ...prev,
      [columnId]: prev[columnId].map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          };
        }
        return task;
      })
    }));
  };

  const handleDragStart = (task, columnId) => {
    setDraggedTask({ task, columnId });
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { task, columnId: sourceColumnId } = draggedTask;

    if (sourceColumnId === targetColumnId) return;

    // Trigger confetti if moving to "done" column
    if (targetColumnId === 'done') {
      triggerConfetti();
    }

    setTasksData(prev => ({
      ...prev,
      [sourceColumnId]: prev[sourceColumnId].filter(t => t.id !== task.id),
      [targetColumnId]: [...prev[targetColumnId], task]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderColumn = (columnId, title) => {
    const tasks = tasksData[columnId] || [];

    return (
      <div
        id={columnId}
        className="task-column"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, columnId)}
      >
        <div className="heading">
          <div className="left">{title}</div>
          <div className="right">{tasks.length}</div>
        </div>
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            columnId={columnId}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDeleteTask={handleDeleteTask}
            toggleSubtask={toggleSubtask}
          />
        ))}
      </div>
    );
  };

  return (
    <main>
      <nav>
        <div className="left">Task Board</div>
        <div className="right">
          <button 
            className="nav-btn share-btn" 
            onClick={() => setShareModalOpen(true)}
          >
            🔗 Share
          </button>
          <button 
            className="nav-btn export-btn" 
            onClick={() => setExportModalOpen(true)}
          >
            📥 Export
          </button>
          <button id="toggle-modal" onClick={() => setModalActive(true)}>
            Add new task
          </button>
        </div>
      </nav>

      <section className="board">
        {renderColumn('todo', 'To Do')}
        {renderColumn('progress', 'In Progress')}
        {renderColumn('done', 'Done')}
      </section>

      <TaskModal
        modalActive={modalActive}
        setModalActive={setModalActive}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDesc={taskDesc}
        setTaskDesc={setTaskDesc}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        dueDate={dueDate}
        setDueDate={setDueDate}
        subtasks={subtasks}
        setSubtasks={setSubtasks}
        handleAddTask={handleAddTask}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        tasksData={tasksData}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        tasksData={tasksData}
      />
    </main>
  );
}