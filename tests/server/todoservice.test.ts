const fs = require('fs');
const path = require('path');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../../server/services/todos');

jest.mock('fs');

describe('Todo Service', () => {
  const dbPath = path.join(__dirname, '../../server/db.json');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should return todos from db.json file', () => {
      const mockData = JSON.stringify({ todos: [{ id: 1, title: 'Test todo', priority: false, completed: false }] });
      fs.readFileSync.mockReturnValue(mockData);

      const todos = getTodos();
      expect(todos).toEqual([{ id: 1, title: 'Test todo', priority: false, completed: false }]);
      expect(fs.readFileSync).toHaveBeenCalledWith(dbPath, 'utf8');
    });

    it('should return an empty array if reading db.json fails', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      const todos = getTodos();
      expect(todos).toEqual([]);
      expect(fs.readFileSync).toHaveBeenCalledWith(dbPath, 'utf8');
    });
  });

  describe('createTodo', () => {
    it('should add a new todo to list and save it to db.json file', () => {
      const mockData = JSON.stringify({ todos: [{ id: 1, title: 'Test todo', priority: false, completed: false }] });
      fs.readFileSync.mockReturnValue(mockData);

      const newItem = { id: 2, title: 'New todo', priority: false, completed: false };
      const expectedData = JSON.stringify({ todos: [{ id: 1, title: 'Test todo', priority: false, completed: false }, { id: 2, title: 'New todo', priority: false, completed: false }] }, null, 2);

      const result = createTodo(newItem);

      expect(result).toEqual(newItem);
      expect(fs.readFileSync).toHaveBeenCalledWith(dbPath, 'utf8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(dbPath, expectedData);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo and save it to db.json file', () => {
      const mockData = JSON.stringify({ todos: [{ id: 1, title: 'Test todo', priority: false, completed: false }, { id: 2, title: 'New todo', priority: false, completed: false }] });
      fs.readFileSync.mockReturnValue(mockData);

      const updatedInfo = { id: 2, title: 'New todo', priority: true, completed: false };
      const result = updateTodo(2, updatedInfo);

      const expectedData = JSON.stringify({ todos: [{ id: 1, title: 'Test todo', priority: false, completed: false }, { id: 2, title: 'New todo', priority: true, completed: false }] }, null, 2);

      expect(result).toEqual(updatedInfo);
      expect(fs.readFileSync).toHaveBeenCalledWith(dbPath, 'utf8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(dbPath, expectedData);
    });
  });

  describe('deleteTodo', () => {
    it('should delete an existing todo and save the updated list to db.json file', () => {
      const mockData = JSON.stringify({ todos: [{ id: 1, title: 'Test todo', priority: false, completed: false }, { id: 2, title: 'New todo', priority: false, completed: false }] });
      fs.readFileSync.mockReturnValue(mockData);

      deleteTodo(2);

      const expectedData = JSON.stringify({ todos: [{ id: 1, title: 'Test todo', priority: false, completed: false }] }, null, 2);

      expect(fs.readFileSync).toHaveBeenCalledWith(dbPath, 'utf8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(dbPath, expectedData);
    });
  });
});
