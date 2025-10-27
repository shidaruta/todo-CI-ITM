import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../TodoItem';

describe('TodoItem Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString()
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo item with correct data', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('applies completed styling when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} {...mockHandlers} />);
    
    const title = screen.getByText('Test Todo');
    expect(title).toHaveClass('line-through');
  });

  it('displays correct priority badge', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    expect(screen.getByText('medium')).toBeInTheDocument();
  });
});