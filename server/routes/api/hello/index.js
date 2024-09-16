const router = require('express').Router();
const { getHello } = require('../../../services/hello');

router.get('/', (req, res) => {
  const message = getHello();
  res.json({ message });
});

module.exports = router;
