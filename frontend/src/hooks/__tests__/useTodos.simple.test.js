// Simple test for useTodos hook
import useTodos from '../useTodos';

describe('useTodos Hook - Simple Tests', () => {
  test('useTodos is a function', () => {
    expect(typeof useTodos).toBe('function');
  });

  test('useTodos returns expected properties', () => {
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(() => 'test-token'),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    // Mock fetch
    window.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    const result = useTodos();
    
    expect(result).toHaveProperty('todos');
    expect(result).toHaveProperty('loading');
    expect(result).toHaveProperty('addTodo');
    expect(result).toHaveProperty('updateTodo');
    expect(result).toHaveProperty('toggleTodoCompletion');
    expect(result).toHaveProperty('deleteTodo');
    expect(result).toHaveProperty('loadTodos');
    
    expect(typeof result.addTodo).toBe('function');
    expect(typeof result.updateTodo).toBe('function');
    expect(typeof result.toggleTodoCompletion).toBe('function');
    expect(typeof result.deleteTodo).toBe('function');
    expect(typeof result.loadTodos).toBe('function');
  });
});
