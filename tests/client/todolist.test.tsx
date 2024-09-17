import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TodoList from '../../client/src/components/todolist';

const mock = new MockAdapter(axios);

describe('TodoList Component', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('renders the ToDoList component', async () => {
    mock.onGet('/api/todos').reply(200, [
      { id: 1, title: 'First Test', completed: false, priority: false }
    ]);

    render(<TodoList />);

    await waitFor(() => expect(screen.getByText('First Test')).toBeInTheDocument());
  });

  it('adds a new todo', async () => {
    mock.onGet('/api/todos').reply(200, []);
    mock.onPost('/api/todos').reply(201, { id: 2, title: 'New Todo', completed: false, priority: false });
    mock.onGet('/api/todos').reply(200, [
      { id: 2, title: 'New Todo', completed: false, priority: false }
    ]);

    render(<TodoList />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Feed the dog' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => expect(screen.getByText('Feed the dog')).toBeInTheDocument());
  });

  it('toggles todo completion and displays the correct icon', async () => {
    mock.onGet('/api/todos').reply(200, [
      { id: 1, title: 'Test Todo', completed: false, priority: false }
    ]);
    mock.onPut('/api/todos/1').reply(200, { id: 1, title: 'Test Todo', completed: true, priority: false });
    mock.onGet('/api/todos').reply(200, [
      { id: 1, title: 'Test Todo', completed: true, priority: false }
    ]);

    render(<TodoList />);

    const initialIcon = screen.getByRole('button', { name: 'example todo' }).querySelector('svg');
    expect(initialIcon).toBeInTheDocument();
    expect(initialIcon).toHaveAttribute('data-icon', 'circle');

    const checkBox = screen.getByRole('button', { name: 'example todo' });
    fireEvent.click(checkBox);

    await waitFor(() => {
      const updatedIcon = screen.getByRole('button', { name: 'example todo' }).querySelector('svg');
      expect(updatedIcon).toBeInTheDocument();
      expect(updatedIcon).toHaveAttribute('data-icon', 'check-circle');
    });
  });

  it('deletes a todo', async () => {
    mock.onGet('/api/todos').reply(200, [
      { id: 1, title: 'Test Todo', completed: false, priority: false }
    ]);
    mock.onDelete('/api/todos/1').reply(200);
    mock.onGet('/api/todos').reply(200, []);

    render(<TodoList />);

    const deleteButton = screen.getByRole('button', { name: 'paint the wall' }).closest('button');
    expect(deleteButton).not.toBeNull();

    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    await waitFor(() => expect(screen.queryByText('paint the wall')).toBeNull());
  });
});
