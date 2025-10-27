import React from 'react';
import TaskItem from './TaskItem';

export default function TodoList({ tasks, onToggle, onDelete, onEdit, filter = 'all' }) {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.done;
    if (filter === 'active') return !task.done;
    return true;
  });

  if (filteredTasks.length === 0) {
    return <p>No todos</p>;
  }

  return (
    <div className="todo-list">
      {filteredTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

