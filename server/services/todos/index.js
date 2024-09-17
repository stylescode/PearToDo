const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../db.json');

const getTodos = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData.todos;
  } catch (error) {
    console.error('Error retrieving todo list info', error);
    return [];
  }
}

const createTodo = (newItem) => {
  try {
    const todos = getTodos();
    todos.push(newItem);
    const newList = { todos };
    fs.writeFileSync(dbPath, JSON.stringify(newList, null, 2));
    return newItem;
  } catch (error) {
    console.error('Error creating new todo', error);
  }
}

const updateTodo = async (id, updatedInfo) => {
  try {
    const todos = getTodos();
    const updatedTodos = await todos.map(todo => {
      if (todo.children) {
        const updatedChildren = todo.children.map(child => {
          const childIdToString = child.id.toString();
          if (childIdToString === id) {
            return updatedInfo;
          }
          return child;
        });
        todo.children = updatedChildren;
      }
      const idToString = todo.id.toString();
      if (idToString === id) {
        return updatedInfo;
      }
      return todo;
    });
    const updatedList = { todos: updatedTodos };
    fs.writeFileSync(dbPath, JSON.stringify(updatedList, null, 2));
    return updatedInfo;
  } catch (error) {
    console.error('Error updating todo', error);
  }
}

const deleteTodo = (id) => {
  try {
    console.log(id);
    const todos = getTodos();
    const updatedTodos = todos.filter(todo => {
      if (todo.children) {
        const updatedChildren = todo.children.filter(child => {
          const childIdToString = child.id.toString();
          if (childIdToString !== id) {
            return child;
          }
        });
        todo.children = updatedChildren;
      }
      const idToString = todo.id.toString();
      if (idToString !== id) {
        return todo;
      }
    });
    const updatedList = { todos: updatedTodos };
    fs.writeFileSync(dbPath, JSON.stringify(updatedList, null, 2));
  } catch (error) {
    console.error('Error deleting todo', error);
  }
}

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
}