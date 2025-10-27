import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      description: 'Description 1',
      completed: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Todo 2',
      description: 'Description 2',
      completed: true,
      priority: 'low'
    }
  ];

  const mockHandlers = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn()
  };

  it('renders all todos', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('renders empty state when no todos', () => {
    render(<TodoList todos={[]} {...mockHandlers} />);
    
    expect(screen.getByText(/no todos/i)).toBeInTheDocument();
  });

  it('filters completed todos', () => {
    const { rerender: _rerender } = render(
  <TodoList todos={mockTodos} filter="completed" {...mockHandlers} />
    );

    
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
  });

  it('filters active todos', () => {
    render(<TodoList todos={mockTodos} filter="active" {...mockHandlers} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();
  });
});