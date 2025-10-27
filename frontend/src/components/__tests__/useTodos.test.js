import { renderHook, act } from '@testing-library/react';
import useTodos from '../useTodos';
import * as api from '../../services/api';

jest.mock('../../services/api');

describe('useTodos Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches todos on mount', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true }
    ];

    api.getTodos.mockResolvedValue(mockTodos);

    const { result, waitForNextUpdate } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();

    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.loading).toBe(false);
  });

  it('adds a new todo', async () => {
    const newTodo = { id: 3, title: 'New Todo', completed: false };
    api.createTodo.mockResolvedValue(newTodo);
    api.getTodos.mockResolvedValue([]);

    const { result, waitForNextUpdate } = renderHook(() => useTodos());
    await waitForNextUpdate();

    await act(async () => {
      await result.current.addTodo({ title: 'New Todo' });
    });

    expect(api.createTodo).toHaveBeenCalledWith({ title: 'New Todo' });
    expect(result.current.todos).toContainEqual(newTodo);
  });
   it('toggles todo completion', async () => {
    const todo = { id: 1, title: 'Todo 1', completed: false };
    const updatedTodo = { ...todo, completed: true };
    api.updateTodo.mockResolvedValue(updatedTodo);
    api.getTodos.mockResolvedValue([todo]);
    const { result, waitForNextUpdate } = renderHook(() => useTodos());
    await waitForNextUpdate();

    await act(async () => {
      await result.current.toggleTodoCompletion(todo.id);
    });

    expect(api.updateTodo).toHaveBeenCalledWith(updatedTodo);
    expect(result.current.todos).toContainEqual(updatedTodo);
  });});