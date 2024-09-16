const router = require('express').Router();
const helloRoutes = require('./hello');

router.use('/hello', helloRoutes);

module.exports = router;
