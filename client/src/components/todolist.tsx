import React, { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import { FaCheckCircle, FaRegCircle, FaRegPlusSquare } from "react-icons/fa";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { IoTrashBin } from "react-icons/io5";
import './todolist.css';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  priority: boolean;
  children?: Todo[];
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');

  const refreshTodos = () => {
    axios.get('http://localhost:3001/api/todos')
      .then((response) => {
        const sortedTodos = response.data;
        // sort by priority
        sortedTodos.sort((a, b) => {
          if (a.priority && !b.priority) {
            return -1;
          }
          if (!a.priority && b.priority) {
            return 1;
          }
          return 0;
        });
        setTodos(sortedTodos);
      });
  }

  useEffect(() => {
    refreshTodos();
  }, [todos]);

  const handleAdd = async () => {
    const id = Date.now();
    const newTodo: Todo = {
      id: id,
      title: input,
      completed: false,
      priority: false,
    };
    await axios.post('http://localhost:3001/api/todos', newTodo);
    setInput('');
    refreshTodos();
  };

  const handleDelete = async (id: number) => {
    console.log('delete item');
    await axios.delete(`http://localhost:3001/api/todos/${id}`)
      .then(() => {
        console.log('deleted');
        return axios.get('http://localhost:3001/api/todos')
      })
      .then((response) => {
        setTodos(response.data);
      });
  }

  const toggleComplete = (todo: Todo) => {
    const updatedItem = { ...todo, completed: !todo.completed };
    axios.put(`http://localhost:3001/api/todos/${todo.id}`, updatedItem)
      .then(() => {
        refreshTodos();
      });
  };

  const togglePriority = (todo: Todo) => {
    const updatedItem = { ...todo, priority: !todo.priority };
    axios.put(`http://localhost:3001/api/todos/${todo.id}`, updatedItem)
      .then(() => {
        refreshTodos();
      });
  }

  const addSubTodo = (todo: Todo) => {
    const input = prompt('Enter sub todo');
    const newTodo = {
      id: Date.now(),
      title: input,
      completed: false,
      priority: false,
    };
    todo.children = todo.children || [];
    const updatedItem = { ...todo, children: [...todo.children, newTodo] };
    axios.put(`http://localhost:3001/api/todos/${todo.id}`, updatedItem)
      .then(() => {
        refreshTodos();
      });
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      <div>
        {todos.map((todo) => (
          <div className="item-container" key={todo.id}>
            <div className="top">
            <div className="left">
              <button onClick={() => toggleComplete(todo)}>
                {todo.completed ? <FaCheckCircle /> : <FaRegCircle />}
              </button>
              <div>
                {todo.title}
              </div>
            </div>
            <div className="right">
              <button onClick={() => addSubTodo(todo)}>
                <FaRegPlusSquare />
              </button>
              <button onClick={() => togglePriority(todo)}>
                {todo.priority ? <TiPin /> : <TiPinOutline />}
              </button>
              <button onClick={() => handleDelete(todo.id)}>
                <IoTrashBin />
              </button>
            </div>
            </div>
            <div className="bottom">
            </div>
            {todo.children && todo.children.map((child) => (
              <div className="sub-item-container" key={child.id}>
                <div className="left">
                  <button onClick={() => toggleComplete(child)}>
                    {child.completed ? <FaCheckCircle /> : <FaRegCircle />}
                  </button>
                  <div>
                    {child.title}
                  </div>
                </div>
                <div className="right">
                  <button onClick={() => handleDelete(child.id)}>
                    <IoTrashBin />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;