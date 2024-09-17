const router = require('express').Router();
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../../../services/todos');

router.get('/', async (req, res) => {
  const todos = await getTodos();
  res.json(todos);
});

router.post('/', async (req, res) => {
  const newItem = req.body;
  const todo = await createTodo(newItem);
  res.json({ todo });
});

router.put('/:id', async (req, res) => {
  const updatedInfo = req.body;
  const todo = await updateTodo(req.params.id, updatedInfo);
  res.json(todo);
});

router.delete('/:id', async (req, res) => {
  await deleteTodo(req.params.id);
  res.json({});
});

module.exports = router;