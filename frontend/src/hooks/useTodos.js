const { useState, useEffect } = require('react');

const API = 'http://localhost:5000/api';

function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(todoData) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(todoData)
      });
      if (!res.ok) throw new Error('Failed to add todo');
      const newTodo = await res.json();
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      console.error('Error adding todo:', err);
      throw err;
    }
  }

  async function updateTodo(todoData) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tasks/${todoData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(todoData)
      });
      if (!res.ok) throw new Error('Failed to update todo');
      const updatedTodo = await res.json();
      setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
      return updatedTodo;
    } catch (err) {
      console.error('Error updating todo:', err);
      throw err;
    }
  }

  async function toggleTodoCompletion(id) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tasks/${id}/toggle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to toggle todo');
      const updatedTodo = await res.json();
      setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
      return updatedTodo;
    } catch (err) {
      console.error('Error toggling todo:', err);
      throw err;
    }
  }

  async function deleteTodo(id) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw err;
    }
  }

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    toggleTodoCompletion,
    deleteTodo,
    loadTodos
  };
}

export default useTodos;

